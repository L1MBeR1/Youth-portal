<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;


class UpdateNewsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = Auth::user();
        Log::info('11111');

        if ($user->hasPermissionTo('edit own news')) {
            Log::info('333');
            return true;
        }

        Log::info('22222');
        return false; // Возвращаем false вместо response()->json()
    }




    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'content' => 'required|string',
            'cover_uri' => 'nullable|string',
            'status' => 'nullable|string|max:255',
            'views' => 'nullable|integer',
            'likes' => 'nullable|integer',
            'reposts' => 'nullable|integer',
        ];
    }

}
