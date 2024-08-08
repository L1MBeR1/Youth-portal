<?php

namespace App\Http\Controllers;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

use Exception;
use Illuminate\Support\Facades\Validator;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected function successResponse($data, $message = 'Success', $status = 200)
    {
        return response()->json([
            'message' => $message,
            'data' => $data
        ], $status);
    }

    protected function errorResponse($message, $errors = [], $status = 400)
    {
        return response()->json([
            'error' => $message, //TODO: подумать над этим
            'messages' => $errors
        ], $status);
    }

    protected function handleException(Exception $e)
    {
        Log::error($e->getMessage());
        if ($e instanceof ValidationException) {
            return $this->errorResponse('Validation Error', $e->errors(), 422);
        }

        if ($e instanceof NotFoundHttpException) {
            return $this->errorResponse('Not Found', ['description' => 'The requested resource was not found.'], 404);
        }

        if ($e instanceof AccessDeniedHttpException) {
            return $this->errorResponse('Access Denied', ['description' => 'You do not have permission to access this resource.'], 403);
        }
        
        if ($e instanceof ModelNotFoundException) {
            return $this->errorResponse('Not Found', ['description' => 'The requested resource was not found.'], 404);
        }
        
        Log::error($e->getMessage());
        return $this->errorResponse('Server Error', [], 500);
    }
}
