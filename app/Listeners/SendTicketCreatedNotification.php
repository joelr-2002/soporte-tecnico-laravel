<?php

namespace App\Listeners;

use App\Events\TicketCreated;
use App\Models\User;
use App\Notifications\TicketCreatedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendTicketCreatedNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     */
    public function handle(TicketCreated $event): void
    {
        $ticket = $event->ticket;

        // Notify the ticket owner (confirmation)
        if ($ticket->user) {
            $ticket->user->notify(new TicketCreatedNotification($ticket, true));
        }

        // Notify all admins and agents about the new ticket
        $staffUsers = User::whereIn('role', [User::ROLE_ADMIN, User::ROLE_AGENT])->get();

        foreach ($staffUsers as $staff) {
            $staff->notify(new TicketCreatedNotification($ticket, false));
        }
    }

    /**
     * Determine whether the listener should be queued.
     */
    public function shouldQueue(TicketCreated $event): bool
    {
        return true;
    }
}
