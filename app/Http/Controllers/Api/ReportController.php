<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    /**
     * Constructor - only admins and agents can access reports.
     */
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if ($request->user()->isClient()) {
                abort(403, 'Unauthorized');
            }
            return $next($request);
        });
    }

    /**
     * Tickets created in date range.
     */
    public function ticketsByPeriod(Request $request): JsonResponse
    {
        $request->validate([
            'date_from' => ['required', 'date'],
            'date_to' => ['required', 'date', 'after_or_equal:date_from'],
            'group_by' => ['nullable', 'in:day,week,month'],
        ]);

        $groupBy = $request->get('group_by', 'day');
        $dateFormat = match ($groupBy) {
            'day' => '%Y-%m-%d',
            'week' => '%Y-%u',
            'month' => '%Y-%m',
        };

        $tickets = Ticket::select(
            DB::raw("DATE_FORMAT(created_at, '{$dateFormat}') as period"),
            DB::raw('COUNT(*) as count')
        )
            ->whereBetween('created_at', [$request->date_from, $request->date_to])
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        return response()->json([
            'data' => $tickets,
            'total' => $tickets->sum('count'),
        ]);
    }

    /**
     * Distribution by status.
     */
    public function ticketsByStatus(Request $request): JsonResponse
    {
        $query = Ticket::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status');

        // Optional date filter
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $data = $query->get();

        return response()->json([
            'data' => $data,
            'total' => $data->sum('count'),
        ]);
    }

    /**
     * Distribution by priority.
     */
    public function ticketsByPriority(Request $request): JsonResponse
    {
        $query = Ticket::select('priority', DB::raw('COUNT(*) as count'))
            ->groupBy('priority');

        // Optional date filter
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $data = $query->get();

        return response()->json([
            'data' => $data,
            'total' => $data->sum('count'),
        ]);
    }

    /**
     * Distribution by category.
     */
    public function ticketsByCategory(Request $request): JsonResponse
    {
        $query = Ticket::select('categories.name as category', DB::raw('COUNT(tickets.id) as count'))
            ->join('categories', 'tickets.category_id', '=', 'categories.id')
            ->groupBy('categories.id', 'categories.name');

        // Optional date filter
        if ($request->filled('date_from')) {
            $query->whereDate('tickets.created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('tickets.created_at', '<=', $request->date_to);
        }

        $data = $query->get();

        return response()->json([
            'data' => $data,
            'total' => $data->sum('count'),
        ]);
    }

    /**
     * Tickets resolved by agent.
     */
    public function agentPerformance(Request $request): JsonResponse
    {
        $query = Ticket::select(
            'users.id',
            'users.name',
            'users.email',
            DB::raw('COUNT(tickets.id) as total_assigned'),
            DB::raw('SUM(CASE WHEN tickets.status IN ("resolved", "closed") THEN 1 ELSE 0 END) as resolved'),
            DB::raw('SUM(CASE WHEN tickets.status = "in_progress" THEN 1 ELSE 0 END) as in_progress')
        )
            ->join('users', 'tickets.assigned_to', '=', 'users.id')
            ->whereNotNull('tickets.assigned_to')
            ->groupBy('users.id', 'users.name', 'users.email');

        // Optional date filter
        if ($request->filled('date_from')) {
            $query->whereDate('tickets.created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('tickets.created_at', '<=', $request->date_to);
        }

        $data = $query->get();

        return response()->json([
            'data' => $data,
        ]);
    }

    /**
     * Average time to resolve tickets.
     */
    public function averageResolutionTime(Request $request): JsonResponse
    {
        $query = Ticket::whereIn('status', [Ticket::STATUS_RESOLVED, Ticket::STATUS_CLOSED])
            ->whereNotNull('updated_at');

        // Optional date filter
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Calculate average resolution time in hours
        $tickets = $query->get();

        if ($tickets->isEmpty()) {
            return response()->json([
                'average_hours' => 0,
                'average_formatted' => '0 hours',
                'total_resolved' => 0,
            ]);
        }

        $totalHours = 0;
        foreach ($tickets as $ticket) {
            $totalHours += $ticket->created_at->diffInHours($ticket->updated_at);
        }

        $averageHours = $totalHours / $tickets->count();

        // Format the average time
        $days = floor($averageHours / 24);
        $hours = $averageHours % 24;
        $formatted = $days > 0
            ? sprintf('%d days, %.1f hours', $days, $hours)
            : sprintf('%.1f hours', $averageHours);

        return response()->json([
            'average_hours' => round($averageHours, 2),
            'average_formatted' => $formatted,
            'total_resolved' => $tickets->count(),
        ]);
    }

    /**
     * Export tickets to CSV.
     */
    public function exportCsv(Request $request): StreamedResponse
    {
        $request->validate([
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date'],
        ]);

        $query = Ticket::with(['user', 'assignedAgent', 'category']);

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $tickets = $query->orderBy('created_at', 'desc')->get();

        $filename = 'tickets_export_' . now()->format('Y-m-d_His') . '.csv';

        return response()->streamDownload(function () use ($tickets) {
            $handle = fopen('php://output', 'w');

            // CSV Header
            fputcsv($handle, [
                'Ticket Number',
                'Title',
                'Status',
                'Priority',
                'Category',
                'Created By',
                'Assigned To',
                'Created At',
                'Updated At',
            ]);

            // CSV Data
            foreach ($tickets as $ticket) {
                fputcsv($handle, [
                    $ticket->ticket_number,
                    $ticket->title,
                    $ticket->status,
                    $ticket->priority,
                    $ticket->category?->name ?? 'N/A',
                    $ticket->user?->name ?? 'N/A',
                    $ticket->assignedAgent?->name ?? 'Unassigned',
                    $ticket->created_at->format('Y-m-d H:i:s'),
                    $ticket->updated_at->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }
}
