<?php

namespace App\Listeners;

use App\Events\TicketStatusChanged;
use App\Models\Ticket;
use App\Notifications\TicketResolvedNotification;
use App\Notifications\TicketStatusChangedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendTicketStatusChangedNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     */
    public function handle(TicketStatusChanged $event): void
    {
        $ticket = $event->ticket;

        // Skip if user doesn't exist
        if (!$ticket->user) {
            return;
        }

        // If ticket is resolved, send the resolved notification instead
        if ($event->newStatus === Ticket::STATUS_RESOLVED) {
            $ticket->user->notify(new TicketResolvedNotification($ticket));
        } else {
            // Send general status change notification
            $ticket->user->notify(new TicketStatusChangedNotification(
                $ticket,
                $event->oldStatus,
                $event->newStatus
            ));
        }
    }

    /**
     * Determine whether the listener should be queued.
     */
    public function shouldQueue(TicketStatusChanged $event): bool
    {
        return true;
    }
}
