<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreResponseTemplateRequest;
use App\Http\Requests\Api\UpdateResponseTemplateRequest;
use App\Http\Resources\ResponseTemplateResource;
use App\Models\ResponseTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ResponseTemplateController extends Controller
{
    /**
     * List templates.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        // Only admins and agents can access templates
        if ($request->user()->isClient()) {
            abort(403, 'Unauthorized');
        }

        $query = ResponseTemplate::with('category');

        // Filter by category
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Search by name or content
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        return ResponseTemplateResource::collection(
            $query->orderBy('name')->paginate($request->get('per_page', 20))
        );
    }

    /**
     * Get a single template.
     */
    public function show(Request $request, ResponseTemplate $responseTemplate): ResponseTemplateResource
    {
        if ($request->user()->isClient()) {
            abort(403, 'Unauthorized');
        }

        $responseTemplate->load('category');

        return new ResponseTemplateResource($responseTemplate);
    }

    /**
     * Create template.
     */
    public function store(StoreResponseTemplateRequest $request): JsonResponse
    {
        $template = ResponseTemplate::create([
            'name' => $request->name,
            'content' => $request->content,
            'category_id' => $request->category_id,
        ]);

        $template->load('category');

        return response()->json([
            'message' => 'Template created successfully',
            'template' => new ResponseTemplateResource($template),
        ], 201);
    }

    /**
     * Update template.
     */
    public function update(UpdateResponseTemplateRequest $request, ResponseTemplate $responseTemplate): JsonResponse
    {
        $responseTemplate->update($request->only(['name', 'content', 'category_id']));

        return response()->json([
            'message' => 'Template updated successfully',
            'template' => new ResponseTemplateResource($responseTemplate->fresh('category')),
        ]);
    }

    /**
     * Delete template.
     */
    public function destroy(Request $request, ResponseTemplate $responseTemplate): JsonResponse
    {
        if ($request->user()->isClient()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $responseTemplate->delete();

        return response()->json([
            'message' => 'Template deleted successfully',
        ]);
    }
}
