<?php

namespace App\Observers;

use App\Models\Sla;
use App\Models\Ticket;

class TicketObserver
{
    /**
     * Handle the Ticket "creating" event.
     */
    public function creating(Ticket $ticket): void
    {
        // Auto-assign SLA based on priority if not already set
        if (empty($ticket->sla_id)) {
            $sla = Sla::where('priority', $ticket->priority)
                ->where('is_active', true)
                ->first();

            if ($sla) {
                $ticket->sla_id = $sla->id;
            }
        }

        // Calculate SLA due times if SLA is assigned
        if ($ticket->sla_id) {
            $this->calculateSlaDueTimes($ticket);
        }
    }

    /**
     * Handle the Ticket "created" event.
     */
    public function created(Ticket $ticket): void
    {
        // Additional actions after ticket creation can go here
    }

    /**
     * Handle the Ticket "updating" event.
     */
    public function updating(Ticket $ticket): void
    {
        // Check if priority changed and SLA needs to be updated
        if ($ticket->isDirty('priority') && !$ticket->isDirty('sla_id')) {
            $sla = Sla::where('priority', $ticket->priority)
                ->where('is_active', true)
                ->first();

            if ($sla) {
                $ticket->sla_id = $sla->id;
                $this->calculateSlaDueTimes($ticket);
            }
        }

        // Check if status changed to resolved or closed
        if ($ticket->isDirty('status')) {
            $newStatus = $ticket->status;

            if (in_array($newStatus, [Ticket::STATUS_RESOLVED, Ticket::STATUS_CLOSED])) {
                // Mark as resolved if not already
                if (empty($ticket->resolved_at)) {
                    $ticket->resolved_at = now();
                }

                // Check if resolution time was breached
                if ($ticket->sla_resolution_due_at && now()->isAfter($ticket->sla_resolution_due_at)) {
                    $ticket->sla_resolution_breached = true;
                }
            }

            // If reopened, clear resolved_at
            if ($newStatus === Ticket::STATUS_OPEN && $ticket->getOriginal('status') === Ticket::STATUS_RESOLVED) {
                $ticket->resolved_at = null;
            }
        }
    }

    /**
     * Handle the Ticket "updated" event.
     */
    public function updated(Ticket $ticket): void
    {
        // Additional actions after ticket update can go here
    }

    /**
     * Calculate SLA due times based on the assigned SLA.
     */
    protected function calculateSlaDueTimes(Ticket $ticket): void
    {
        $sla = $ticket->sla_id ? Sla::find($ticket->sla_id) : null;

        if (!$sla) {
            return;
        }

        $baseTime = $ticket->created_at ?? now();

        // Calculate response due time
        $ticket->sla_response_due_at = $baseTime->copy()->addMinutes($sla->response_time);

        // Calculate resolution due time
        $ticket->sla_resolution_due_at = $baseTime->copy()->addMinutes($sla->resolution_time);
    }

    /**
     * Mark the first response time on a ticket.
     * This should be called when an agent responds to a ticket.
     */
    public static function markFirstResponse(Ticket $ticket): void
    {
        if ($ticket->first_response_at) {
            return; // Already responded
        }

        $ticket->first_response_at = now();

        // Check if response time was breached
        if ($ticket->sla_response_due_at && now()->isAfter($ticket->sla_response_due_at)) {
            $ticket->sla_response_breached = true;
        }

        $ticket->save();
    }

    /**
     * Recalculate SLA due times (useful when SLA is manually changed).
     */
    public static function recalculateSlaDueTimes(Ticket $ticket): void
    {
        $sla = $ticket->sla;

        if (!$sla) {
            $ticket->sla_response_due_at = null;
            $ticket->sla_resolution_due_at = null;
            $ticket->save();
            return;
        }

        $baseTime = $ticket->created_at;

        // Calculate response due time
        $ticket->sla_response_due_at = $baseTime->copy()->addMinutes($sla->response_time);

        // Calculate resolution due time
        $ticket->sla_resolution_due_at = $baseTime->copy()->addMinutes($sla->resolution_time);

        $ticket->save();
    }
}
