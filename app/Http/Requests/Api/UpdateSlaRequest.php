<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSlaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'priority' => [
                'sometimes',
                'required',
                Rule::in(['low', 'medium', 'high', 'urgent']),
            ],
            'response_time' => ['sometimes', 'required', 'integer', 'min:1'],
            'resolution_time' => ['sometimes', 'required', 'integer', 'min:1'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $responseTime = $this->response_time ?? $this->route('sla')->response_time;
            $resolutionTime = $this->resolution_time ?? $this->route('sla')->resolution_time;

            if ($resolutionTime < $responseTime) {
                $validator->errors()->add(
                    'resolution_time',
                    'The resolution time must be greater than or equal to the response time.'
                );
            }
        });
    }
}
