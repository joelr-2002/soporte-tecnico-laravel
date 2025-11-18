<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreUserRequest;
use App\Http\Requests\Api\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserController extends Controller
{
    /**
     * List users with filters.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $query = User::query();

        // Filter by role
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        // Search by name or email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortField = $request->get('sort_by', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        return UserResource::collection(
            $query->paginate($request->get('per_page', 15))
        );
    }

    /**
     * Get user details.
     */
    public function show(Request $request, User $user): UserResource
    {
        if (!$request->user()->isAdmin() && $request->user()->id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        return new UserResource($user);
    }

    /**
     * Create user (admin only).
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => $request->role,
            'phone' => $request->phone,
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => new UserResource($user),
        ], 201);
    }

    /**
     * Update user (admin only).
     */
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $data = $request->only(['name', 'email', 'role', 'phone']);

        if ($request->filled('password')) {
            $data['password'] = $request->password;
        }

        $user->update($data);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => new UserResource($user->fresh()),
        ]);
    }

    /**
     * Delete user (admin only).
     */
    public function destroy(Request $request, User $user): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        // Prevent self-deletion
        if ($request->user()->id === $user->id) {
            return response()->json([
                'message' => 'Cannot delete your own account',
            ], 422);
        }

        // Check if user has tickets
        if ($user->tickets()->exists() || $user->assignedTickets()->exists()) {
            return response()->json([
                'message' => 'Cannot delete user with existing tickets. Consider deactivating instead.',
            ], 422);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }

    /**
     * List only agents (for assignment dropdown).
     */
    public function agents(Request $request): AnonymousResourceCollection
    {
        $query = User::whereIn('role', [User::ROLE_AGENT, User::ROLE_ADMIN])
            ->orderBy('name');

        return UserResource::collection($query->get());
    }
}
