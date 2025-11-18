<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTicketRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'priority' => ['required', 'string', 'in:low,medium,high,urgent'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'attachments' => ['nullable', 'array'],
            'attachments.*' => ['file', 'max:10240'], // 10MB max per file
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'El titulo es obligatorio.',
            'title.string' => 'El titulo debe ser una cadena de texto.',
            'title.max' => 'El titulo no puede tener mas de 255 caracteres.',
            'description.required' => 'La descripcion es obligatoria.',
            'description.string' => 'La descripcion debe ser una cadena de texto.',
            'priority.required' => 'La prioridad es obligatoria.',
            'priority.string' => 'La prioridad debe ser una cadena de texto.',
            'priority.in' => 'La prioridad debe ser: baja, media, alta o urgente.',
            'category_id.required' => 'La categoria es obligatoria.',
            'category_id.integer' => 'La categoria debe ser un numero entero.',
            'category_id.exists' => 'La categoria seleccionada no existe.',
            'attachments.array' => 'Los archivos adjuntos deben ser un arreglo.',
            'attachments.*.file' => 'Cada adjunto debe ser un archivo valido.',
            'attachments.*.max' => 'Cada archivo adjunto no puede superar los 10MB.',
        ];
    }
}
