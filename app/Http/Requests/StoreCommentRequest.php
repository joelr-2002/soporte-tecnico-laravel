<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCommentRequest extends FormRequest
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
            'content' => ['required', 'string'],
            'is_internal' => ['nullable', 'boolean'],
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
            'content.required' => 'El contenido del comentario es obligatorio.',
            'content.string' => 'El contenido del comentario debe ser una cadena de texto.',
            'is_internal.boolean' => 'El campo interno debe ser verdadero o falso.',
            'attachments.array' => 'Los archivos adjuntos deben ser un arreglo.',
            'attachments.*.file' => 'Cada adjunto debe ser un archivo valido.',
            'attachments.*.max' => 'Cada archivo adjunto no puede superar los 10MB.',
        ];
    }
}
