<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreCommentRequest;
use App\Http\Requests\Api\UpdateCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class CommentController extends Controller
{
    /**
     * List comments for a ticket.
     */
    public function index(Request $request, Ticket $ticket): AnonymousResourceCollection
    {
        $this->authorize('viewAny', [Comment::class, $ticket]);

        $query = $ticket->comments()->with(['user', 'attachments']);

        // Clients should not see internal comments
        if ($request->user()->isClient()) {
            $query->where('is_internal', false);
        }

        return CommentResource::collection(
            $query->orderBy('created_at', 'asc')
                ->paginate($request->get('per_page', 50))
        );
    }

    /**
     * Create comment with optional attachments.
     */
    public function store(StoreCommentRequest $request, Ticket $ticket): JsonResponse
    {
        $this->authorize('create', [Comment::class, $ticket]);

        $comment = DB::transaction(function () use ($request, $ticket) {
            // Clients cannot create internal comments
            $isInternal = false;
            if (!$request->user()->isClient()) {
                $isInternal = $request->boolean('is_internal', false);
            }

            $comment = $ticket->comments()->create([
                'user_id' => $request->user()->id,
                'content' => $request->content,
                'is_internal' => $isInternal,
            ]);

            // Handle attachments
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('attachments/comments', 'public');

                    $comment->attachments()->create([
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => $path,
                        'file_size' => $file->getSize(),
                        'mime_type' => $file->getMimeType(),
                    ]);
                }
            }

            return $comment;
        });

        // Update ticket status to in_progress if it was open
        if ($ticket->status === Ticket::STATUS_OPEN || $ticket->status === Ticket::STATUS_NEW) {
            if (!$request->user()->isClient()) {
                $ticket->update(['status' => Ticket::STATUS_IN_PROGRESS]);
            }
        }

        $comment->load(['user', 'attachments']);

        return response()->json([
            'message' => 'Comment created successfully',
            'comment' => new CommentResource($comment),
        ], 201);
    }

    /**
     * Update comment content.
     */
    public function update(UpdateCommentRequest $request, Ticket $ticket, Comment $comment): JsonResponse
    {
        // Verify comment belongs to ticket
        if ($comment->ticket_id !== $ticket->id) {
            return response()->json([
                'message' => 'Comment not found for this ticket',
            ], 404);
        }

        $this->authorize('update', $comment);

        $comment->update([
            'content' => $request->content,
        ]);

        return response()->json([
            'message' => 'Comment updated successfully',
            'comment' => new CommentResource($comment->fresh(['user', 'attachments'])),
        ]);
    }

    /**
     * Delete comment.
     */
    public function destroy(Request $request, Ticket $ticket, Comment $comment): JsonResponse
    {
        // Verify comment belongs to ticket
        if ($comment->ticket_id !== $ticket->id) {
            return response()->json([
                'message' => 'Comment not found for this ticket',
            ], 404);
        }

        $this->authorize('delete', $comment);

        // Delete attachments from storage
        foreach ($comment->attachments as $attachment) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($attachment->file_path);
        }

        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted successfully',
        ]);
    }
}
