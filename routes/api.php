<?php

use Illuminate\Support\Facades\Route;

Route::get('/api/hello', function () {
    return response()->json([
        'success' => 1,
        'message' => 'merry christmas and happy new year 2026'
    ]);
})->name('api_hello');
