<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PesanController;
Route::get('/', function () {
    return view('welcome');
});
Route::post('/pesan', [PesanController::class, 'store'])->name('pesan.store');