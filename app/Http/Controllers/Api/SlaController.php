<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreSlaRequest;
use App\Http\Requests\Api\UpdateSlaRequest;
use App\Http\Resources\SlaResource;
use App\Models\Sla;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SlaController extends Controller
{
    /**
     * List all SLAs.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Sla::withCount('tickets');

        // For non-admin users, only show active SLAs
        if (!$request->user()->isAdmin()) {
            $query->where('is_active', true);
        }

        // Filter by priority if specified
        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        // Filter by active status if specified
        if ($request->has('is_active') && $request->user()->isAdmin()) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        return SlaResource::collection(
            $query->orderBy('priority')->orderBy('name')->get()
        );
    }

    /**
     * Create a new SLA (admin only).
     */
    public function store(StoreSlaRequest $request): JsonResponse
    {
        // Deactivate existing SLA for the same priority if new one is active
        if ($request->boolean('is_active', true)) {
            Sla::where('priority', $request->priority)
                ->where('is_active', true)
                ->update(['is_active' => false]);
        }

        $sla = Sla::create([
            'name' => $request->name,
            'description' => $request->description,
            'priority' => $request->priority,
            'response_time' => $request->response_time,
            'resolution_time' => $request->resolution_time,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return response()->json([
            'message' => 'SLA created successfully',
            'sla' => new SlaResource($sla),
        ], 201);
    }

    /**
     * Get a single SLA.
     */
    public function show(Sla $sla): SlaResource
    {
        $sla->loadCount('tickets');

        return new SlaResource($sla);
    }

    /**
     * Update an SLA (admin only).
     */
    public function update(UpdateSlaRequest $request, Sla $sla): JsonResponse
    {
        // If activating this SLA, deactivate others with same priority
        if ($request->boolean('is_active', $sla->is_active)) {
            $priority = $request->priority ?? $sla->priority;
            Sla::where('priority', $priority)
                ->where('id', '!=', $sla->id)
                ->where('is_active', true)
                ->update(['is_active' => false]);
        }

        $sla->update($request->only([
            'name',
            'description',
            'priority',
            'response_time',
            'resolution_time',
            'is_active',
        ]));

        return response()->json([
            'message' => 'SLA updated successfully',
            'sla' => new SlaResource($sla->fresh()->loadCount('tickets')),
        ]);
    }

    /**
     * Delete an SLA (admin only).
     */
    public function destroy(Request $request, Sla $sla): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        // Check if SLA has tickets
        if ($sla->tickets()->exists()) {
            return response()->json([
                'message' => 'Cannot delete SLA with existing tickets. Please reassign tickets first.',
            ], 422);
        }

        $sla->delete();

        return response()->json([
            'message' => 'SLA deleted successfully',
        ]);
    }

    /**
     * Get SLA compliance statistics.
     */
    public function compliance(Request $request): JsonResponse
    {
        $user = $request->user();

        // Base query for tickets with SLA
        $baseQuery = Ticket::whereNotNull('sla_id');

        // Role-based filtering
        if ($user->isClient()) {
            $baseQuery->where('user_id', $user->id);
        } elseif ($user->isAgent()) {
            $baseQuery->where(function ($q) use ($user) {
                $q->where('assigned_to', $user->id)
                    ->orWhereNull('assigned_to');
            });
        }

        // Date range filter
        if ($request->has('date_from')) {
            $baseQuery->where('created_at', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $baseQuery->where('created_at', '<=', $request->date_to . ' 23:59:59');
        }

        // Calculate statistics
        $totalWithSla = (clone $baseQuery)->count();

        $responseBreached = (clone $baseQuery)->where('sla_response_breached', true)->count();
        $resolutionBreached = (clone $baseQuery)->where('sla_resolution_breached', true)->count();

        $responseCompliant = $totalWithSla - $responseBreached;
        $resolutionCompliant = $totalWithSla - $resolutionBreached;

        // At risk tickets (not breached but close)
        $atRiskResponse = (clone $baseQuery)
            ->where('sla_response_breached', false)
            ->whereNull('first_response_at')
            ->whereRaw('sla_response_due_at <= DATE_ADD(NOW(), INTERVAL 30 MINUTE)')
            ->whereRaw('sla_response_due_at > NOW()')
            ->count();

        $atRiskResolution = (clone $baseQuery)
            ->where('sla_resolution_breached', false)
            ->whereNull('resolved_at')
            ->whereRaw('sla_resolution_due_at <= DATE_ADD(NOW(), INTERVAL 60 MINUTE)')
            ->whereRaw('sla_resolution_due_at > NOW()')
            ->count();

        // Calculate compliance percentages
        $responseComplianceRate = $totalWithSla > 0
            ? round(($responseCompliant / $totalWithSla) * 100, 2)
            : 100;
        $resolutionComplianceRate = $totalWithSla > 0
            ? round(($resolutionCompliant / $totalWithSla) * 100, 2)
            : 100;

        // Compliance by priority
        $complianceByPriority = [];
        foreach (['low', 'medium', 'high', 'urgent'] as $priority) {
            $priorityQuery = (clone $baseQuery)->whereHas('sla', function ($q) use ($priority) {
                $q->where('priority', $priority);
            });

            $priorityTotal = (clone $priorityQuery)->count();
            $priorityResponseBreached = (clone $priorityQuery)->where('sla_response_breached', true)->count();
            $priorityResolutionBreached = (clone $priorityQuery)->where('sla_resolution_breached', true)->count();

            $complianceByPriority[$priority] = [
                'total' => $priorityTotal,
                'response_breached' => $priorityResponseBreached,
                'resolution_breached' => $priorityResolutionBreached,
                'response_compliance_rate' => $priorityTotal > 0
                    ? round((($priorityTotal - $priorityResponseBreached) / $priorityTotal) * 100, 2)
                    : 100,
                'resolution_compliance_rate' => $priorityTotal > 0
                    ? round((($priorityTotal - $priorityResolutionBreached) / $priorityTotal) * 100, 2)
                    : 100,
            ];
        }

        return response()->json([
            'total_tickets_with_sla' => $totalWithSla,
            'response' => [
                'compliant' => $responseCompliant,
                'breached' => $responseBreached,
                'at_risk' => $atRiskResponse,
                'compliance_rate' => $responseComplianceRate,
            ],
            'resolution' => [
                'compliant' => $resolutionCompliant,
                'breached' => $resolutionBreached,
                'at_risk' => $atRiskResolution,
                'compliance_rate' => $resolutionComplianceRate,
            ],
            'by_priority' => $complianceByPriority,
        ]);
    }

    /**
     * Get tickets that are about to breach SLA.
     */
    public function atRisk(Request $request): JsonResponse
    {
        $user = $request->user();
        $minutesThreshold = $request->integer('minutes', 60);

        $query = Ticket::with(['user', 'assignedAgent', 'category', 'sla'])
            ->whereNotNull('sla_id')
            ->where(function ($q) use ($minutesThreshold) {
                // Response at risk
                $q->where(function ($q2) use ($minutesThreshold) {
                    $q2->where('sla_response_breached', false)
                        ->whereNull('first_response_at')
                        ->whereRaw("sla_response_due_at <= DATE_ADD(NOW(), INTERVAL ? MINUTE)", [$minutesThreshold])
                        ->whereRaw('sla_response_due_at > NOW()');
                })
                // Resolution at risk
                ->orWhere(function ($q2) use ($minutesThreshold) {
                    $q2->where('sla_resolution_breached', false)
                        ->whereNull('resolved_at')
                        ->whereRaw("sla_resolution_due_at <= DATE_ADD(NOW(), INTERVAL ? MINUTE)", [$minutesThreshold])
                        ->whereRaw('sla_resolution_due_at > NOW()');
                });
            });

        // Role-based filtering
        if ($user->isClient()) {
            $query->where('user_id', $user->id);
        } elseif ($user->isAgent()) {
            $query->where(function ($q) use ($user) {
                $q->where('assigned_to', $user->id)
                    ->orWhereNull('assigned_to');
            });
        }

        $tickets = $query->orderByRaw('LEAST(COALESCE(sla_response_due_at, "9999-12-31"), COALESCE(sla_resolution_due_at, "9999-12-31")) ASC')
            ->limit(50)
            ->get();

        return response()->json([
            'tickets' => $tickets->map(function ($ticket) {
                return [
                    'id' => $ticket->id,
                    'ticket_number' => $ticket->ticket_number,
                    'title' => $ticket->title,
                    'priority' => $ticket->priority,
                    'status' => $ticket->status,
                    'sla_name' => $ticket->sla?->name,
                    'response_time_remaining' => $ticket->response_time_remaining,
                    'resolution_time_remaining' => $ticket->resolution_time_remaining,
                    'sla_response_due_at' => $ticket->sla_response_due_at,
                    'sla_resolution_due_at' => $ticket->sla_resolution_due_at,
                    'assigned_agent' => $ticket->assignedAgent ? [
                        'id' => $ticket->assignedAgent->id,
                        'name' => $ticket->assignedAgent->name,
                    ] : null,
                    'created_at' => $ticket->created_at,
                ];
            }),
        ]);
    }

    /**
     * Get breached tickets.
     */
    public function breached(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Ticket::with(['user', 'assignedAgent', 'category', 'sla'])
            ->whereNotNull('sla_id')
            ->where(function ($q) {
                $q->where('sla_response_breached', true)
                    ->orWhere('sla_resolution_breached', true);
            });

        // Role-based filtering
        if ($user->isClient()) {
            $query->where('user_id', $user->id);
        } elseif ($user->isAgent()) {
            $query->where(function ($q) use ($user) {
                $q->where('assigned_to', $user->id)
                    ->orWhereNull('assigned_to');
            });
        }

        // Filter by breach type
        if ($request->has('type')) {
            if ($request->type === 'response') {
                $query->where('sla_response_breached', true);
            } elseif ($request->type === 'resolution') {
                $query->where('sla_resolution_breached', true);
            }
        }

        $perPage = $request->integer('per_page', 15);
        $tickets = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'data' => $tickets->map(function ($ticket) {
                return [
                    'id' => $ticket->id,
                    'ticket_number' => $ticket->ticket_number,
                    'title' => $ticket->title,
                    'priority' => $ticket->priority,
                    'status' => $ticket->status,
                    'sla_name' => $ticket->sla?->name,
                    'sla_response_breached' => $ticket->sla_response_breached,
                    'sla_resolution_breached' => $ticket->sla_resolution_breached,
                    'first_response_at' => $ticket->first_response_at,
                    'resolved_at' => $ticket->resolved_at,
                    'sla_response_due_at' => $ticket->sla_response_due_at,
                    'sla_resolution_due_at' => $ticket->sla_resolution_due_at,
                    'assigned_agent' => $ticket->assignedAgent ? [
                        'id' => $ticket->assignedAgent->id,
                        'name' => $ticket->assignedAgent->name,
                    ] : null,
                    'created_at' => $ticket->created_at,
                ];
            }),
            'meta' => [
                'current_page' => $tickets->currentPage(),
                'last_page' => $tickets->lastPage(),
                'per_page' => $tickets->perPage(),
                'total' => $tickets->total(),
            ],
        ]);
    }
}
