<?php

namespace App\Services;

use App\Events\CommentAdded;
use App\Events\TicketAssigned;
use App\Events\TicketCreated;
use App\Events\TicketResolved;
use App\Events\TicketStatusChanged;
use App\Models\Comment;
use App\Models\Notification;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class NotificationService
{
    /**
     * Dispatch ticket created event and notifications.
     */
    public function ticketCreated(Ticket $ticket): void
    {
        event(new TicketCreated($ticket));
    }

    /**
     * Dispatch ticket assigned event and notifications.
     */
    public function ticketAssigned(Ticket $ticket, int $agentId): void
    {
        event(new TicketAssigned($ticket, $agentId));
    }

    /**
     * Dispatch ticket status changed event and notifications.
     */
    public function ticketStatusChanged(Ticket $ticket, string $oldStatus, string $newStatus): void
    {
        // If changing to resolved, use the resolved event
        if ($newStatus === Ticket::STATUS_RESOLVED) {
            event(new TicketResolved($ticket));
        } else {
            event(new TicketStatusChanged($ticket, $oldStatus, $newStatus));
        }
    }

    /**
     * Dispatch comment added event and notifications.
     */
    public function commentAdded(Ticket $ticket, Comment $comment): void
    {
        event(new CommentAdded($ticket, $comment));
    }

    /**
     * Dispatch ticket resolved event and notifications.
     */
    public function ticketResolved(Ticket $ticket): void
    {
        event(new TicketResolved($ticket));
    }

    /**
     * Create a custom in-app notification.
     */
    public function createNotification(
        User $user,
        string $type,
        array $data,
        ?int $ticketId = null
    ): Notification {
        return Notification::create([
            'user_id' => $user->id,
            'type' => $type,
            'data' => array_merge($data, [
                'ticket_id' => $ticketId,
                'created_at' => now()->toIso8601String(),
            ]),
        ]);
    }

    /**
     * Create notifications for multiple users.
     */
    public function createNotificationForUsers(
        Collection $users,
        string $type,
        array $data,
        ?int $ticketId = null
    ): void {
        $notifications = $users->map(function (User $user) use ($type, $data, $ticketId) {
            return [
                'id' => \Illuminate\Support\Str::uuid()->toString(),
                'user_id' => $user->id,
                'type' => $type,
                'data' => json_encode(array_merge($data, [
                    'ticket_id' => $ticketId,
                    'created_at' => now()->toIso8601String(),
                ])),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        })->toArray();

        DB::table('notifications')->insert($notifications);
    }

    /**
     * Get unread notifications count for a user.
     */
    public function getUnreadCount(User $user): int
    {
        return Notification::where('user_id', $user->id)
            ->unread()
            ->count();
    }

    /**
     * Get user notifications.
     */
    public function getUserNotifications(User $user, int $limit = 20): Collection
    {
        return Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Mark notification as read.
     */
    public function markAsRead(Notification $notification): void
    {
        $notification->update(['read_at' => now()]);
    }

    /**
     * Mark all notifications as read for a user.
     */
    public function markAllAsRead(User $user): void
    {
        Notification::where('user_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    /**
     * Delete old notifications.
     */
    public function deleteOldNotifications(int $days = 30): int
    {
        return Notification::where('created_at', '<', now()->subDays($days))
            ->whereNotNull('read_at')
            ->delete();
    }

    /**
     * Prepare data for real-time broadcast (future implementation).
     */
    public function prepareBroadcastData(string $event, array $data): array
    {
        return [
            'event' => $event,
            'data' => $data,
            'timestamp' => now()->toIso8601String(),
        ];
    }

    /**
     * Broadcast to a specific user channel (future implementation).
     */
    public function broadcastToUser(User $user, string $event, array $data): void
    {
        // Future: Implement with Laravel Broadcasting (Pusher, Socket.io, etc.)
        // broadcast(new GenericNotification($user, $event, $data))->toOthers();

        $channel = "user.{$user->id}";
        $broadcastData = $this->prepareBroadcastData($event, $data);

        // Log for now, implement broadcasting later
        \Illuminate\Support\Facades\Log::info("Broadcast to {$channel}", $broadcastData);
    }

    /**
     * Broadcast to ticket channel (future implementation).
     */
    public function broadcastToTicket(Ticket $ticket, string $event, array $data): void
    {
        // Future: Implement with Laravel Broadcasting
        $channel = "ticket.{$ticket->id}";
        $broadcastData = $this->prepareBroadcastData($event, $data);

        // Log for now, implement broadcasting later
        \Illuminate\Support\Facades\Log::info("Broadcast to {$channel}", $broadcastData);
    }

    /**
     * Broadcast to all staff members (future implementation).
     */
    public function broadcastToStaff(string $event, array $data): void
    {
        // Future: Implement with Laravel Broadcasting
        $channel = 'staff';
        $broadcastData = $this->prepareBroadcastData($event, $data);

        // Log for now, implement broadcasting later
        \Illuminate\Support\Facades\Log::info("Broadcast to {$channel}", $broadcastData);
    }
}
