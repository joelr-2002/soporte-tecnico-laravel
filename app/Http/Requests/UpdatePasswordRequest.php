<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdatePasswordRequest extends FormRequest
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
            'current_password' => ['required', 'string', 'current_password'],
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
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
            'current_password.required' => 'La contrasena actual es obligatoria.',
            'current_password.string' => 'La contrasena actual debe ser una cadena de texto.',
            'current_password.current_password' => 'La contrasena actual es incorrecta.',
            'password.required' => 'La nueva contrasena es obligatoria.',
            'password.string' => 'La nueva contrasena debe ser una cadena de texto.',
            'password.confirmed' => 'La confirmacion de la nueva contrasena no coincide.',
        ];
    }
}
