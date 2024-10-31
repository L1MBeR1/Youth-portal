<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReportRequest extends FormRequest
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
            // 'resource_type' => 'required|string|in:blog,news,podcast,comment,user',
            // 'resource_id' => 'required|integer',
            // 'report_id' => 'required|integer',
            'reason' => 'required|string',
            'details' => 'nullable|string'
        ];
    }

    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        $response = response()->json([
            'message' => 'Validation Error',
            'errors' => $validator->errors(),
        ], 422);
        throw new \Illuminate\Http\Exceptions\HttpResponseException($response);
    }
}
