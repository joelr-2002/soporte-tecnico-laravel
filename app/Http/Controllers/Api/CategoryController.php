<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreCategoryRequest;
use App\Http\Requests\Api\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CategoryController extends Controller
{
    /**
     * List all active categories.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Category::withCount('tickets');

        // For non-admin users, only show active categories
        if (!$request->user()->isAdmin()) {
            $query->where('is_active', true);
        }

        // Optional: show all categories for admins
        if ($request->boolean('all') && $request->user()->isAdmin()) {
            // Show all including inactive
        } else if (!$request->user()->isAdmin()) {
            $query->where('is_active', true);
        }

        return CategoryResource::collection(
            $query->orderBy('name')->get()
        );
    }

    /**
     * Create category (admin only).
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = Category::create([
            'name' => $request->name,
            'description' => $request->description,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return response()->json([
            'message' => 'Category created successfully',
            'category' => new CategoryResource($category),
        ], 201);
    }

    /**
     * Get a single category.
     */
    public function show(Category $category): CategoryResource
    {
        $category->loadCount('tickets');

        return new CategoryResource($category);
    }

    /**
     * Update category (admin only).
     */
    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        $category->update($request->only(['name', 'description', 'is_active']));

        return response()->json([
            'message' => 'Category updated successfully',
            'category' => new CategoryResource($category->fresh()->loadCount('tickets')),
        ]);
    }

    /**
     * Delete category (admin only).
     */
    public function destroy(Request $request, Category $category): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        // Check if category has tickets
        if ($category->tickets()->exists()) {
            return response()->json([
                'message' => 'Cannot delete category with existing tickets',
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully',
        ]);
    }
}
