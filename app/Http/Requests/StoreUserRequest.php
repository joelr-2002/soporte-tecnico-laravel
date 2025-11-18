<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
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
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
            'role' => ['required', 'string', 'in:admin,agent,user'],
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
            'name.required' => 'El nombre es obligatorio.',
            'name.string' => 'El nombre debe ser una cadena de texto.',
            'name.max' => 'El nombre no puede tener mas de 255 caracteres.',
            'email.required' => 'El correo electronico es obligatorio.',
            'email.string' => 'El correo electronico debe ser una cadena de texto.',
            'email.email' => 'El correo electronico debe ser una direccion valida.',
            'email.max' => 'El correo electronico no puede tener mas de 255 caracteres.',
            'email.unique' => 'Este correo electronico ya esta registrado.',
            'password.required' => 'La contrasena es obligatoria.',
            'password.string' => 'La contrasena debe ser una cadena de texto.',
            'password.confirmed' => 'La confirmacion de la contrasena no coincide.',
            'role.required' => 'El rol es obligatorio.',
            'role.string' => 'El rol debe ser una cadena de texto.',
            'role.in' => 'El rol debe ser: administrador, agente o usuario.',
        ];
    }
}
