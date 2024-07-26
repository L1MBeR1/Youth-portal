<?php

namespace App\Http\Requests;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Http\FormRequest;

class StorePodcastRequest extends FormRequest
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
    public function rules()
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

    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        Log::info('Validation failed: ', $validator->errors()->toArray());

        $response = response()->json([
            'message' => 'Validation Error',
            'errors' => $validator->errors(),
        ], 422);

        throw new \Illuminate\Http\Exceptions\HttpResponseException($response);
    }
}
