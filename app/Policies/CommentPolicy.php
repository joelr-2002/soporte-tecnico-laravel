<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CommentPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     * Based on ticket access - admin/agent can view any, client only their ticket's comments.
     */
    public function viewAny(User $user, Ticket $ticket): bool
    {
        if ($user->isAdmin() || $user->isAgent()) {
            return true;
        }

        return $user->id === $ticket->user_id;
    }

    /**
     * Determine whether the user can view the model.
     * Admin/agent can view all comments (including internal).
     * Client can view non-internal comments on their own tickets only.
     */
    public function view(User $user, Comment $comment): bool
    {
        if ($user->isAdmin() || $user->isAgent()) {
            return true;
        }

        // Client can only view non-internal comments on their own tickets
        if ($comment->is_internal) {
            return false;
        }

        return $user->id === $comment->ticket->user_id;
    }

    /**
     * Determine whether the user can create models.
     * Based on ticket access - admin/agent can create on any ticket, client only on their own tickets.
     */
    public function create(User $user, Ticket $ticket): bool
    {
        if ($user->isAdmin() || $user->isAgent()) {
            return true;
        }

        return $user->id === $ticket->user_id;
    }

    /**
     * Determine whether the user can update the model.
     * Only own comments within 15 minutes of creation.
     */
    public function update(User $user, Comment $comment): bool
    {
        // Must be the comment owner
        if ($user->id !== $comment->user_id) {
            return false;
        }

        // Must be within 15 minutes of creation
        return $comment->created_at->diffInMinutes(now()) <= 15;
    }

    /**
     * Determine whether the user can delete the model.
     * Admin can delete any comment, or own comments within 15 minutes.
     */
    public function delete(User $user, Comment $comment): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        // Own comments within 15 minutes
        if ($user->id === $comment->user_id) {
            return $comment->created_at->diffInMinutes(now()) <= 15;
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     * Only admin can restore soft-deleted comments.
     */
    public function restore(User $user, Comment $comment): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can permanently delete the model.
     * Only admin can force delete comments.
     */
    public function forceDelete(User $user, Comment $comment): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can create internal comments.
     * Only admin and agent can create internal comments.
     */
    public function createInternal(User $user, Ticket $ticket): bool
    {
        return $user->isAdmin() || $user->isAgent();
    }
}
