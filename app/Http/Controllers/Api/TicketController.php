<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreTicketRequest;
use App\Http\Requests\Api\UpdateTicketRequest;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class TicketController extends Controller
{
    /**
     * List tickets with filters.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        $query = Ticket::with(['user', 'assignedAgent', 'category'])
            ->withCount(['comments', 'attachments']);

        // Apply role-based filtering
        if ($user->isClient()) {
            $query->where('user_id', $user->id);
        } elseif ($user->isAgent()) {
            $query->where(function ($q) use ($user) {
                $q->where('assigned_to', $user->id)
                    ->orWhereNull('assigned_to');
            });
        }

        // Apply filters
        if ($request->filled('status')) {
            $query->byStatus($request->status);
        }

        if ($request->filled('priority')) {
            $query->byPriority($request->priority);
        }

        if ($request->filled('category_id')) {
            $query->byCategory($request->category_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('ticket_number', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        // Sorting
        $sortField = $request->get('sort_by', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        return TicketResource::collection(
            $query->paginate($request->get('per_page', 15))
        );
    }

    /**
     * Get single ticket with comments and attachments.
     */
    public function show(Request $request, Ticket $ticket): TicketResource
    {
        $this->authorize('view', $ticket);

        $ticket->load([
            'user',
            'assignedAgent',
            'category',
            'comments' => function ($query) use ($request) {
                // Clients should not see internal comments
                if ($request->user()->isClient()) {
                    $query->where('is_internal', false);
                }
                $query->with(['user', 'attachments'])->orderBy('created_at', 'asc');
            },
            'attachments',
        ]);

        return new TicketResource($ticket);
    }

    /**
     * Create new ticket with optional attachments.
     */
    public function store(StoreTicketRequest $request): JsonResponse
    {
        $ticket = DB::transaction(function () use ($request) {
            $ticket = Ticket::create([
                'user_id' => $request->user()->id,
                'title' => $request->title,
                'description' => $request->description,
                'category_id' => $request->category_id,
                'priority' => $request->priority,
                'status' => Ticket::STATUS_NEW,
            ]);

            // Handle attachments
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('attachments/tickets', 'public');

                    $ticket->attachments()->create([
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => $path,
                        'file_size' => $file->getSize(),
                        'mime_type' => $file->getMimeType(),
                    ]);
                }
            }

            return $ticket;
        });

        $ticket->load(['user', 'category', 'attachments']);

        return response()->json([
            'message' => 'Ticket created successfully',
            'ticket' => new TicketResource($ticket),
        ], 201);
    }

    /**
     * Update ticket.
     */
    public function update(UpdateTicketRequest $request, Ticket $ticket): JsonResponse
    {
        $this->authorize('update', $ticket);

        $user = $request->user();
        $data = [];

        // Clients can only update title and description
        if ($user->isClient()) {
            $data = $request->only(['title', 'description']);
        } else {
            $data = $request->only(['title', 'description', 'category_id', 'priority', 'status']);
        }

        $ticket->update($data);

        return response()->json([
            'message' => 'Ticket updated successfully',
            'ticket' => new TicketResource($ticket->fresh(['user', 'assignedAgent', 'category'])),
        ]);
    }

    /**
     * Soft delete ticket.
     */
    public function destroy(Ticket $ticket): JsonResponse
    {
        $this->authorize('delete', $ticket);

        $ticket->delete();

        return response()->json([
            'message' => 'Ticket deleted successfully',
        ]);
    }

    /**
     * Assign ticket to agent.
     */
    public function assign(Request $request, Ticket $ticket): JsonResponse
    {
        $this->authorize('assign', $ticket);

        $request->validate([
            'agent_id' => ['required', 'exists:users,id', function ($attribute, $value, $fail) {
                $user = User::find($value);
                if (!$user || (!$user->isAgent() && !$user->isAdmin())) {
                    $fail('The selected user is not an agent.');
                }
            }],
        ]);

        $ticket->update([
            'assigned_to' => $request->agent_id,
            'status' => $ticket->status === Ticket::STATUS_NEW ? Ticket::STATUS_OPEN : $ticket->status,
        ]);

        return response()->json([
            'message' => 'Ticket assigned successfully',
            'ticket' => new TicketResource($ticket->fresh(['user', 'assignedAgent', 'category'])),
        ]);
    }

    /**
     * Change ticket status.
     */
    public function changeStatus(Request $request, Ticket $ticket): JsonResponse
    {
        $this->authorize('changeStatus', $ticket);

        $request->validate([
            'status' => [
                'required',
                Rule::in([
                    Ticket::STATUS_NEW,
                    Ticket::STATUS_OPEN,
                    Ticket::STATUS_IN_PROGRESS,
                    Ticket::STATUS_ON_HOLD,
                    Ticket::STATUS_RESOLVED,
                    Ticket::STATUS_CLOSED,
                ]),
            ],
        ]);

        // Clients can only close resolved tickets
        if ($request->user()->isClient()) {
            if ($ticket->status !== Ticket::STATUS_RESOLVED || $request->status !== Ticket::STATUS_CLOSED) {
                return response()->json([
                    'message' => 'You can only close resolved tickets',
                ], 403);
            }
        }

        $ticket->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Ticket status updated successfully',
            'ticket' => new TicketResource($ticket->fresh(['user', 'assignedAgent', 'category'])),
        ]);
    }

    /**
     * Get ticket statistics for dashboard.
     */
    public function statistics(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Ticket::query();

        // Apply role-based filtering
        if ($user->isClient()) {
            $query->where('user_id', $user->id);
        } elseif ($user->isAgent()) {
            $query->where('assigned_to', $user->id);
        }

        $stats = [
            'total' => (clone $query)->count(),
            'by_status' => [
                'new' => (clone $query)->where('status', Ticket::STATUS_NEW)->count(),
                'open' => (clone $query)->where('status', Ticket::STATUS_OPEN)->count(),
                'in_progress' => (clone $query)->where('status', Ticket::STATUS_IN_PROGRESS)->count(),
                'on_hold' => (clone $query)->where('status', Ticket::STATUS_ON_HOLD)->count(),
                'resolved' => (clone $query)->where('status', Ticket::STATUS_RESOLVED)->count(),
                'closed' => (clone $query)->where('status', Ticket::STATUS_CLOSED)->count(),
            ],
            'by_priority' => [
                'low' => (clone $query)->where('priority', Ticket::PRIORITY_LOW)->count(),
                'medium' => (clone $query)->where('priority', Ticket::PRIORITY_MEDIUM)->count(),
                'high' => (clone $query)->where('priority', Ticket::PRIORITY_HIGH)->count(),
                'urgent' => (clone $query)->where('priority', Ticket::PRIORITY_URGENT)->count(),
            ],
            'recent' => TicketResource::collection(
                (clone $query)->with(['user', 'category'])
                    ->latest()
                    ->take(5)
                    ->get()
            ),
        ];

        return response()->json($stats);
    }
}
