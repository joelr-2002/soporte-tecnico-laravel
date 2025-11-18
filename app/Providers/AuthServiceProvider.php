<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Comment;
use App\Models\Ticket;
use App\Models\User;
use App\Policies\CategoryPolicy;
use App\Policies\CommentPolicy;
use App\Policies\TicketPolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Ticket::class => TicketPolicy::class,
        Comment::class => CommentPolicy::class,
        Category::class => CategoryPolicy::class,
        User::class => UserPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Additional gates can be defined here if needed

        // Gate to check if user can manage tickets (admin or agent)
        Gate::define('manage-tickets', function (User $user) {
            return $user->isAdmin() || $user->isAgent();
        });

        // Gate to check if user is admin
        Gate::define('admin', function (User $user) {
            return $user->isAdmin();
        });

        // Gate to check if user is an agent
        Gate::define('agent', function (User $user) {
            return $user->isAgent();
        });

        // Gate to check if user is a client
        Gate::define('client', function (User $user) {
            return $user->isClient();
        });
    }
}
