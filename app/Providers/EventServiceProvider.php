<?php

namespace App\Providers;

use App\Events\CommentAdded;
use App\Events\TicketAssigned;
use App\Events\TicketCreated;
use App\Events\TicketResolved;
use App\Events\TicketStatusChanged;
use App\Listeners\SendNewCommentNotification;
use App\Listeners\SendTicketAssignedNotification;
use App\Listeners\SendTicketCreatedNotification;
use App\Listeners\SendTicketResolvedNotification;
use App\Listeners\SendTicketStatusChangedNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        TicketCreated::class => [
            SendTicketCreatedNotification::class,
        ],
        TicketAssigned::class => [
            SendTicketAssignedNotification::class,
        ],
        TicketStatusChanged::class => [
            SendTicketStatusChangedNotification::class,
        ],
        CommentAdded::class => [
            SendNewCommentNotification::class,
        ],
        TicketResolved::class => [
            SendTicketResolvedNotification::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        parent::boot();
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
