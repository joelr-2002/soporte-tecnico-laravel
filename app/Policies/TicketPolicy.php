<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TicketPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     * All authenticated users can view tickets (filtered by role in controller).
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     * Admin/agent can view any ticket, client only their own.
     */
    public function view(User $user, Ticket $ticket): bool
    {
        if ($user->isAdmin() || $user->isAgent()) {
            return true;
        }

        return $user->id === $ticket->user_id;
    }

    /**
     * Determine whether the user can create models.
     * All authenticated users can create tickets.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     * Admin can update any, agent can update assigned tickets, client can update own tickets.
     */
    public function update(User $user, Ticket $ticket): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isAgent()) {
            return $ticket->assigned_to === $user->id;
        }

        // Client can update their own tickets (controller should restrict which fields)
        return $user->id === $ticket->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     * Only admin can delete tickets.
     */
    public function delete(User $user, Ticket $ticket): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can restore the model.
     * Only admin can restore soft-deleted tickets.
     */
    public function restore(User $user, Ticket $ticket): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can permanently delete the model.
     * Only admin can force delete tickets.
     */
    public function forceDelete(User $user, Ticket $ticket): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can assign the ticket to an agent.
     * Only admin and agent can assign tickets.
     */
    public function assign(User $user, Ticket $ticket): bool
    {
        return $user->isAdmin() || $user->isAgent();
    }

    /**
     * Determine whether the user can change the ticket status.
     * Only admin and agent can change ticket status.
     */
    public function changeStatus(User $user, Ticket $ticket): bool
    {
        return $user->isAdmin() || $user->isAgent();
    }

    /**
     * Determine whether the user can add a comment to the ticket.
     * Admin/agent can comment on any ticket, client only on their own tickets.
     */
    public function addComment(User $user, Ticket $ticket): bool
    {
        if ($user->isAdmin() || $user->isAgent()) {
            return true;
        }

        return $user->id === $ticket->user_id;
    }
}
