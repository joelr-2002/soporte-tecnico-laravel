<?php

namespace App\Http\Resources;

use App\Http\Resources\SlaResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ticket_number' => $this->ticket_number,
            'title' => $this->title,
            'description' => $this->description,
            'priority' => $this->priority,
            'status' => $this->status,
            'user' => new UserResource($this->whenLoaded('user')),
            'assigned_agent' => new UserResource($this->whenLoaded('assignedAgent')),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'sla' => new SlaResource($this->whenLoaded('sla')),
            'comments' => CommentResource::collection($this->whenLoaded('comments')),
            'attachments' => AttachmentResource::collection($this->whenLoaded('attachments')),
            'comments_count' => $this->whenCounted('comments'),
            'attachments_count' => $this->whenCounted('attachments'),
            // SLA fields
            'first_response_at' => $this->first_response_at,
            'sla_response_due_at' => $this->sla_response_due_at,
            'sla_resolution_due_at' => $this->sla_resolution_due_at,
            'sla_response_breached' => $this->sla_response_breached,
            'sla_resolution_breached' => $this->sla_resolution_breached,
            'resolved_at' => $this->resolved_at,
            'response_time_remaining' => $this->response_time_remaining,
            'resolution_time_remaining' => $this->resolution_time_remaining,
            'sla_status' => $this->sla_status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
        ];
    }
}
