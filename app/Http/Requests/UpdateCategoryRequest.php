<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
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
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('categories')->ignore($this->route('category')),
            ],
            'description' => ['nullable', 'string'],
            'color' => ['nullable', 'string', 'max:7'],
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
            'name.required' => 'El nombre de la categoria es obligatorio.',
            'name.string' => 'El nombre de la categoria debe ser una cadena de texto.',
            'name.max' => 'El nombre de la categoria no puede tener mas de 255 caracteres.',
            'name.unique' => 'Ya existe una categoria con este nombre.',
            'description.string' => 'La descripcion debe ser una cadena de texto.',
            'color.string' => 'El color debe ser una cadena de texto.',
            'color.max' => 'El color no puede tener mas de 7 caracteres.',
            'is_active.boolean' => 'El campo activo debe ser verdadero o falso.',
        ];
    }
}
