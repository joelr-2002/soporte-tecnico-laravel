<?php

namespace App\Http\Requests\Api;

use App\Models\Ticket;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTicketRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'priority' => [
                'sometimes',
                'required',
                Rule::in([
                    Ticket::PRIORITY_LOW,
                    Ticket::PRIORITY_MEDIUM,
                    Ticket::PRIORITY_HIGH,
                    Ticket::PRIORITY_URGENT,
                ]),
            ],
            'status' => [
                'sometimes',
                'required',
                Rule::in([
                    Ticket::STATUS_NEW,
                    Ticket::STATUS_OPEN,
                    Ticket::STATUS_IN_PROGRESS,
                    Ticket::STATUS_ON_HOLD,
                    Ticket::STATUS_RESOLVED,
                    Ticket::STATUS_CLOSED,
                ]),
            ],
        ];
    }
}
