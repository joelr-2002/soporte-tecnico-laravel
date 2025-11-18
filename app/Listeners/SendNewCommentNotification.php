<?php

namespace App\Listeners;

use App\Events\CommentAdded;
use App\Models\User;
use App\Notifications\NewCommentNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendNewCommentNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     */
    public function handle(CommentAdded $event): void
    {
        $ticket = $event->ticket;
        $comment = $event->comment;

        // Don't notify for internal comments to clients
        if ($comment->is_internal) {
            $this->notifyInternalComment($ticket, $comment);
            return;
        }

        $commenter = $comment->user;

        // If comment is from a client, notify the assigned agent
        if ($commenter && $commenter->isClient()) {
            if ($ticket->assigned_to && $ticket->assigned_to !== $comment->user_id) {
                $agent = User::find($ticket->assigned_to);
                if ($agent) {
                    $agent->notify(new NewCommentNotification($ticket, $comment));
                }
            }

            // Also notify admins
            $this->notifyAdmins($ticket, $comment);
        } else {
            // Comment is from agent/admin, notify the ticket owner
            if ($ticket->user && $ticket->user_id !== $comment->user_id) {
                $ticket->user->notify(new NewCommentNotification($ticket, $comment));
            }
        }
    }

    /**
     * Notify admins about the new comment.
     */
    protected function notifyAdmins(mixed $ticket, mixed $comment): void
    {
        $admins = User::where('role', User::ROLE_ADMIN)
            ->where('id', '!=', $comment->user_id)
            ->get();

        foreach ($admins as $admin) {
            $admin->notify(new NewCommentNotification($ticket, $comment));
        }
    }

    /**
     * Notify about internal comments (only to staff).
     */
    protected function notifyInternalComment(mixed $ticket, mixed $comment): void
    {
        // Notify assigned agent if they didn't write the comment
        if ($ticket->assigned_to && $ticket->assigned_to !== $comment->user_id) {
            $agent = User::find($ticket->assigned_to);
            if ($agent) {
                $agent->notify(new NewCommentNotification($ticket, $comment));
            }
        }

        // Notify admins
        $this->notifyAdmins($ticket, $comment);
    }

    /**
     * Determine whether the listener should be queued.
     */
    public function shouldQueue(CommentAdded $event): bool
    {
        return true;
    }
}
