<?php

namespace App\Listeners;

use App\Events\TicketResolved;
use App\Notifications\TicketResolvedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendTicketResolvedNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     */
    public function handle(TicketResolved $event): void
    {
        $ticket = $event->ticket;

        // Notify the ticket owner
        if ($ticket->user) {
            $ticket->user->notify(new TicketResolvedNotification($ticket));
        }
    }

    /**
     * Determine whether the listener should be queued.
     */
    public function shouldQueue(TicketResolved $event): bool
    {
        return true;
    }
}
