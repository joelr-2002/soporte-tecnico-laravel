<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application.
| These routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group.
|
*/

// Public routes
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Guest routes (authentication pages)
Route::middleware('guest')->group(function () {
    Route::get('login', function () {
        return Inertia::render('auth/Login');
    })->name('login');

    Route::get('register', function () {
        return Inertia::render('auth/Register');
    })->name('register');

    Route::get('forgot-password', function () {
        return Inertia::render('auth/ForgotPassword');
    })->name('password.request');

    Route::get('reset-password/{token}', function (string $token) {
        return Inertia::render('auth/ResetPassword', ['token' => $token]);
    })->name('password.reset');

    // React Router compatible routes (with /auth prefix)
    Route::get('auth/login', function () {
        return Inertia::render('auth/Login');
    });

    Route::get('auth/register', function () {
        return Inertia::render('auth/Register');
    });

    Route::get('auth/forgot-password', function () {
        return Inertia::render('auth/ForgotPassword');
    });

    Route::get('auth/reset-password', function () {
        return Inertia::render('auth/ResetPassword');
    });
});

// Protected routes (require authentication)
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Tickets
    Route::prefix('tickets')->name('tickets.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('tickets/TicketList');
        })->name('index');

        Route::get('/create', function () {
            return Inertia::render('tickets/TicketCreate');
        })->name('create');

        Route::get('/{id}', function ($id) {
            return Inertia::render('tickets/TicketView', ['id' => $id]);
        })->name('show');

        Route::get('/{id}/edit', function ($id) {
            return Inertia::render('tickets/TicketEdit', ['id' => $id]);
        })->name('edit');
    });

    // Assigned tickets (for agents)
    Route::get('assigned', function () {
        return Inertia::render('AssignedTickets');
    })->name('assigned');

    // Knowledge Base
    Route::get('knowledge-base', function () {
        return Inertia::render('KnowledgeBase');
    })->name('knowledge-base');

    // Reports
    Route::get('reports', function () {
        return Inertia::render('Reports');
    })->name('reports');

    // Notifications
    Route::get('notifications', function () {
        return Inertia::render('Notifications');
    })->name('notifications');

    // Profile
    Route::get('profile', function () {
        return Inertia::render('Profile');
    })->name('profile');

    // Admin routes
    Route::prefix('admin')->name('admin.')->middleware('auth')->group(function () {
        Route::get('/users', function () {
            return Inertia::render('admin/Users');
        })->name('users');

        Route::get('/categories', function () {
            return Inertia::render('admin/Categories');
        })->name('categories');

        Route::get('/response-templates', function () {
            return Inertia::render('admin/ResponseTemplates');
        })->name('response-templates');

        Route::get('/slas', function () {
            return Inertia::render('admin/Slas');
        })->name('slas');

        Route::get('/settings', function () {
            return Inertia::render('admin/Settings');
        })->name('settings');
    });
});

// Settings routes
require __DIR__.'/settings.php';
