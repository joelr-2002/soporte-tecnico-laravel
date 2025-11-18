<?php

namespace App\Listeners;

use App\Events\TicketAssigned;
use App\Models\User;
use App\Notifications\TicketAssignedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendTicketAssignedNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     */
    public function handle(TicketAssigned $event): void
    {
        $ticket = $event->ticket;
        $agent = User::find($event->agentId);

        if ($agent) {
            $agent->notify(new TicketAssignedNotification($ticket));
        }
    }

    /**
     * Determine whether the listener should be queued.
     */
    public function shouldQueue(TicketAssigned $event): bool
    {
        return true;
    }
}
