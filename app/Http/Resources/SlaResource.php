<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SlaResource extends JsonResource
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
            'name' => $this->name,
            'description' => $this->description,
            'priority' => $this->priority,
            'response_time' => $this->response_time,
            'resolution_time' => $this->resolution_time,
            'response_time_hours' => $this->response_time_hours,
            'resolution_time_hours' => $this->resolution_time_hours,
            'formatted_response_time' => $this->formatted_response_time,
            'formatted_resolution_time' => $this->formatted_resolution_time,
            'is_active' => $this->is_active,
            'tickets_count' => $this->whenCounted('tickets'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
