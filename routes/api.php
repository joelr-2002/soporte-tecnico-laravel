<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ResponseTemplateController;
use App\Http\Controllers\Api\ReportController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/user/password', [AuthController::class, 'updatePassword']);

    // Tickets
    Route::prefix('tickets')->group(function () {
        Route::get('/', [TicketController::class, 'index']);
        Route::post('/', [TicketController::class, 'store']);
        Route::get('/statistics', [TicketController::class, 'statistics']);
        Route::get('/{ticket}', [TicketController::class, 'show']);
        Route::put('/{ticket}', [TicketController::class, 'update']);
        Route::delete('/{ticket}', [TicketController::class, 'destroy']);
        Route::post('/{ticket}/assign', [TicketController::class, 'assign']);
        Route::post('/{ticket}/status', [TicketController::class, 'updateStatus']);

        // Comments nested under tickets
        Route::get('/{ticket}/comments', [CommentController::class, 'index']);
        Route::post('/{ticket}/comments', [CommentController::class, 'store']);
    });

    // Comments (standalone routes for update/delete)
    Route::put('/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

    // Categories (admin routes)
    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::post('/', [CategoryController::class, 'store']);
        Route::get('/{category}', [CategoryController::class, 'show']);
        Route::put('/{category}', [CategoryController::class, 'update']);
        Route::delete('/{category}', [CategoryController::class, 'destroy']);
    });

    // Users (admin routes)
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::get('/agents', [UserController::class, 'agents']);
        Route::get('/{user}', [UserController::class, 'show']);
        Route::put('/{user}', [UserController::class, 'update']);
        Route::delete('/{user}', [UserController::class, 'destroy']);
    });

    // Notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
        Route::post('/read-all', [NotificationController::class, 'readAll']);
        Route::post('/{notification}/read', [NotificationController::class, 'read']);
    });

    // Response Templates
    Route::prefix('response-templates')->group(function () {
        Route::get('/', [ResponseTemplateController::class, 'index']);
        Route::post('/', [ResponseTemplateController::class, 'store']);
        Route::get('/{responseTemplate}', [ResponseTemplateController::class, 'show']);
        Route::put('/{responseTemplate}', [ResponseTemplateController::class, 'update']);
        Route::delete('/{responseTemplate}', [ResponseTemplateController::class, 'destroy']);
    });

    // Reports
    Route::prefix('reports')->group(function () {
        Route::get('/tickets-by-period', [ReportController::class, 'ticketsByPeriod']);
        Route::get('/tickets-by-status', [ReportController::class, 'ticketsByStatus']);
        Route::get('/tickets-by-priority', [ReportController::class, 'ticketsByPriority']);
        Route::get('/tickets-by-category', [ReportController::class, 'ticketsByCategory']);
        Route::get('/agent-performance', [ReportController::class, 'agentPerformance']);
        Route::get('/resolution-time', [ReportController::class, 'resolutionTime']);
        Route::get('/export-csv', [ReportController::class, 'exportCsv']);
    });
});
