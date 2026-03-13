<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\UserDashboardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserAuthController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\UserGroupMappingController;
use App\Models\Admin;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });








Route::middleware(['secure.api'])->group(function () {
    Route::post('/register', [UserAuthController::class, 'register']);
    Route::post('/login', [UserAuthController::class, 'login']);
});
Route::middleware(['auth:sanctum'])->post('/logout', [UserAuthController::class, 'logout']);


// User routes
Route::middleware(['secure.api', 'auth:sanctum'])->group(function () {
    Route::get('/user/dashboard', [UserDashboardController::class, 'dashboard']);
    Route::get('/user/profile',[UserDashboardController::class,'profile']);
    Route::post('user/change-password',[UserDashboardController::class,'changePassword']);
    Route::post('/user/add-expense', [ExpenseController::class, 'store']); // Add expense
    Route::get('/user/expense-list', [ExpenseController::class, 'index']); // Get expense list
    Route::get('/user/expense-detail/{id}', [ExpenseController::class, 'show']);
    Route::put('/user/edit-expense/{id}', [ExpenseController::class, 'update']);
    Route::get('/user/group_master', [ExpenseController::class, 'groupMaster']);
   Route::get('/user/group_detail_with_each_expense/{id}',[ExpenseController::class,'group_detail_with_each_expense']);

});



Route::middleware(['secure.api'])->group(function () {

    Route::post('admin/login', [AdminAuthController::class, 'login']);
});


// Admin routes
Route::middleware(['secure.api', 'auth:admin-api'])->group(function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'dashboard']);
    Route::get('admin/users', [AdminDashboardController::class, 'userList']);
    Route::post('admin/group', [GroupController::class, 'store']);
    Route::get('admin/groups', [GroupController::class, 'list']);
    Route::get('admin/edit_group/{id}', [GroupController::class, 'show']);
    Route::put('admin/update_group/{id}', [GroupController::class, 'update']);
    Route::get('admin/expense_list', [AdminDashboardController::class, 'expenseList']);

    Route::get('admin/user_group_create', [UserGroupMappingController::class, 'create']);
    Route::post('admin/user_group_store', [UserGroupMappingController::class, 'store']);
    Route::get('admin/group_wise_users_count', [AdminDashboardController::class, 'groupWiseUsersCount']);
    Route::get('admin/group_wise_users_list/{id}', [AdminDashboardController::class, 'groupWiseUsersList']);
});

Route::post('admin/logout',[AdminDashboardController::class,'logout'])->middleware('auth:admin-api');


Route::any('/__test', function () {
    return response()->json(['api' => 'working']);
});
