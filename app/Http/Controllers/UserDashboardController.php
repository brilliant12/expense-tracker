<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserDashboardController extends Controller
{

public function profile(Request $request){
     $authId = auth()->id();
     return response()->json([
        'success'  => true,
        'message' => 'Welcome to User Dashboard',
        'data'    => [
            'user'   => $request->user()
            //'groups' => $groupsWithExpenses
        ]
    ]);
}

public function changePassword(Request $request)
{
    $user = $request->user();
    $authId = auth()->id();

    // Validate input
    $validator = Validator::make($request->all(), [
        'current_password' => 'required|min:6',
        'new_password'     => 'required|min:6',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => $validator->errors()->first(),
        ], 422);
    }

    $currentPassword = $request->input('current_password');
    $newPassword     = $request->input('new_password');

   
    if (!Hash::check($currentPassword, $user->password)) {
        return response()->json([
            'success' => false,
            'message' => 'Current password is invalid',
        ], 422);
    }

    // Update password
    User::where('id', $authId)->update([
        'password' => Hash::make($newPassword),
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Password changed successfully',
    ], 200);
}

public function dashboard(Request $request)
{
    $authId = auth()->id();

    $groupsWithExpenses = DB::table('user_group_mappings as um')
        ->join('groups as g', 'um.group_id', '=', 'g.id')
        ->leftJoin('expenses as e', 'g.id', '=', 'e.group_id')
        ->where('um.user_id', $authId)
        ->select(
            'g.id as group_id',
            'g.group_name',
            // count members from mapping table, not expenses
            DB::raw('(SELECT COUNT(DISTINCT ugm.user_id) 
                      FROM user_group_mappings ugm 
                      WHERE ugm.group_id = g.id) as total_users_in_group'),
            DB::raw('COALESCE(SUM(e.amount),0) as total_group_expenses'),
            DB::raw('COALESCE(SUM(CASE WHEN e.user_id = '.$authId.' THEN e.amount ELSE 0 END),0) as user_total_expenses')
        )
        ->groupBy('g.id','g.group_name')
        ->get()
        ->map(function ($row) {
            $row->split_expense_per_user = $row->total_users_in_group > 0
                ? ($row->total_group_expenses / $row->total_users_in_group)
                : 0;
            return $row;
        });

    return response()->json([
        'success'  => true,
        'message' => 'Welcome to User Dashboard',
        'data'    => [
            'user'   => $request->user(),
            'groups' => $groupsWithExpenses
        ]
    ]);
}



}
