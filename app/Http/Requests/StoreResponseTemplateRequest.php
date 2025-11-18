<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreResponseTemplateRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'is_active' => ['nullable', 'boolean'],
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
            'name.required' => 'El nombre de la plantilla es obligatorio.',
            'name.string' => 'El nombre de la plantilla debe ser una cadena de texto.',
            'name.max' => 'El nombre de la plantilla no puede tener mas de 255 caracteres.',
            'content.required' => 'El contenido de la plantilla es obligatorio.',
            'content.string' => 'El contenido de la plantilla debe ser una cadena de texto.',
            'category_id.integer' => 'La categoria debe ser un numero entero.',
            'category_id.exists' => 'La categoria seleccionada no existe.',
            'is_active.boolean' => 'El campo activo debe ser verdadero o falso.',
        ];
    }
}
