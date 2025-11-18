<?php

namespace App\Console\Commands;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CheckSlaBreaches extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sla:check-breaches
                            {--notify : Send notifications for breaches}
                            {--dry-run : Show what would be updated without making changes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check and mark tickets that have breached their SLA';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Checking for SLA breaches...');

        $dryRun = $this->option('dry-run');
        $notify = $this->option('notify');

        // Check response time breaches
        $responseBreaches = $this->checkResponseBreaches($dryRun);

        // Check resolution time breaches
        $resolutionBreaches = $this->checkResolutionBreaches($dryRun);

        // Check at-risk tickets and send notifications
        if ($notify && !$dryRun) {
            $this->sendAtRiskNotifications();
        }

        $this->newLine();
        $this->info("Summary:");
        $this->line("- Response time breaches: {$responseBreaches}");
        $this->line("- Resolution time breaches: {$resolutionBreaches}");

        if ($dryRun) {
            $this->warn('Dry run mode - no changes were made');
        }

        return Command::SUCCESS;
    }

    /**
     * Check and mark tickets that have breached response time SLA.
     */
    protected function checkResponseBreaches(bool $dryRun): int
    {
        $query = Ticket::whereNotNull('sla_id')
            ->whereNotNull('sla_response_due_at')
            ->whereNull('first_response_at')
            ->where('sla_response_breached', false)
            ->where('sla_response_due_at', '<', now());

        $count = $query->count();

        if ($count > 0) {
            $this->info("Found {$count} tickets with breached response time SLA");

            if (!$dryRun) {
                $tickets = $query->get();

                foreach ($tickets as $ticket) {
                    $ticket->update(['sla_response_breached' => true]);

                    Log::info("SLA Response breach marked", [
                        'ticket_id' => $ticket->id,
                        'ticket_number' => $ticket->ticket_number,
                        'due_at' => $ticket->sla_response_due_at,
                    ]);

                    // Create notification for assigned agent and admins
                    $this->createBreachNotification($ticket, 'response');
                }
            }
        }

        return $count;
    }

    /**
     * Check and mark tickets that have breached resolution time SLA.
     */
    protected function checkResolutionBreaches(bool $dryRun): int
    {
        $query = Ticket::whereNotNull('sla_id')
            ->whereNotNull('sla_resolution_due_at')
            ->whereNull('resolved_at')
            ->where('sla_resolution_breached', false)
            ->where('sla_resolution_due_at', '<', now());

        $count = $query->count();

        if ($count > 0) {
            $this->info("Found {$count} tickets with breached resolution time SLA");

            if (!$dryRun) {
                $tickets = $query->get();

                foreach ($tickets as $ticket) {
                    $ticket->update(['sla_resolution_breached' => true]);

                    Log::info("SLA Resolution breach marked", [
                        'ticket_id' => $ticket->id,
                        'ticket_number' => $ticket->ticket_number,
                        'due_at' => $ticket->sla_resolution_due_at,
                    ]);

                    // Create notification for assigned agent and admins
                    $this->createBreachNotification($ticket, 'resolution');
                }
            }
        }

        return $count;
    }

    /**
     * Create notification for SLA breach.
     */
    protected function createBreachNotification(Ticket $ticket, string $type): void
    {
        $title = $type === 'response'
            ? "SLA Response Time Breached"
            : "SLA Resolution Time Breached";

        $message = $type === 'response'
            ? "Ticket {$ticket->ticket_number} has breached its response time SLA."
            : "Ticket {$ticket->ticket_number} has breached its resolution time SLA.";

        // Notify assigned agent if exists
        if ($ticket->assigned_to) {
            DB::table('notifications')->insert([
                'user_id' => $ticket->assigned_to,
                'type' => 'sla_breach',
                'title' => $title,
                'message' => $message,
                'data' => json_encode([
                    'ticket_id' => $ticket->id,
                    'ticket_number' => $ticket->ticket_number,
                    'breach_type' => $type,
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Notify all admins
        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            DB::table('notifications')->insert([
                'user_id' => $admin->id,
                'type' => 'sla_breach',
                'title' => $title,
                'message' => $message,
                'data' => json_encode([
                    'ticket_id' => $ticket->id,
                    'ticket_number' => $ticket->ticket_number,
                    'breach_type' => $type,
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Send notifications for tickets at risk of breaching SLA.
     */
    protected function sendAtRiskNotifications(): void
    {
        // Tickets at risk of breaching response time (within 30 minutes)
        $atRiskResponse = Ticket::with('assignedAgent')
            ->whereNotNull('sla_id')
            ->whereNotNull('sla_response_due_at')
            ->whereNull('first_response_at')
            ->where('sla_response_breached', false)
            ->whereBetween('sla_response_due_at', [now(), now()->addMinutes(30)])
            ->get();

        foreach ($atRiskResponse as $ticket) {
            $this->createAtRiskNotification($ticket, 'response');
        }

        // Tickets at risk of breaching resolution time (within 60 minutes)
        $atRiskResolution = Ticket::with('assignedAgent')
            ->whereNotNull('sla_id')
            ->whereNotNull('sla_resolution_due_at')
            ->whereNull('resolved_at')
            ->where('sla_resolution_breached', false)
            ->whereBetween('sla_resolution_due_at', [now(), now()->addMinutes(60)])
            ->get();

        foreach ($atRiskResolution as $ticket) {
            $this->createAtRiskNotification($ticket, 'resolution');
        }

        $this->info("Sent at-risk notifications: {$atRiskResponse->count()} response, {$atRiskResolution->count()} resolution");
    }

    /**
     * Create notification for at-risk SLA.
     */
    protected function createAtRiskNotification(Ticket $ticket, string $type): void
    {
        $dueAt = $type === 'response' ? $ticket->sla_response_due_at : $ticket->sla_resolution_due_at;
        $minutesRemaining = now()->diffInMinutes($dueAt);

        $title = $type === 'response'
            ? "SLA Response Time Warning"
            : "SLA Resolution Time Warning";

        $message = "Ticket {$ticket->ticket_number} will breach {$type} SLA in {$minutesRemaining} minutes.";

        // Notify assigned agent if exists
        if ($ticket->assigned_to) {
            DB::table('notifications')->insert([
                'user_id' => $ticket->assigned_to,
                'type' => 'sla_warning',
                'title' => $title,
                'message' => $message,
                'data' => json_encode([
                    'ticket_id' => $ticket->id,
                    'ticket_number' => $ticket->ticket_number,
                    'warning_type' => $type,
                    'minutes_remaining' => $minutesRemaining,
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
