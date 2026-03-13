<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function dashboard(Request $request)
    {
        $totalUsers   = User::count();
        $totalGroups  = Group::count();
        $totalExpenses = Expense::count();

        $recentExpenses = Expense::with([
            'user:id,name',
            'group:id,group_name'
        ])->select(
            'id',
            'expense_name',
            'expense_description',
            'amount',
            'user_id',
            'group_id',
            'status'
        )
            ->latest()
            ->take(5)
            ->get(['id', 'expense_name', 'amount', 'status']);

        return response()->json([
            'success' => true,
            'message' => 'Welcome to Admin Dashboard',
            'data' => [
                'totalUsers'     => $totalUsers,
                'totalGroups'    => $totalGroups,
                'totalExpenses'  => $totalExpenses,
                'recentExpenses' => $recentExpenses,
            ],
            'admin' => $request->user('admin-api')
        ]);
    }

    public function userList()
    {
        return response()->json([
            'success' => true,
            'message' => 'UserList',
            'data' => User::all(),
        ]);
    }

    public function expenseList()
    {
        $expenses = Expense::with([
            'user:id,name',
            'group:id,group_name'
        ])->select(
            'id',
            'expense_name',
            'expense_description',
            'amount',
            'user_id',
            'group_id',
            'status'
        )->get();
        return response()->json([
            'success' => true,
            'message' => 'Expense List',
            'data' => $expenses
        ]);
    }

    public function groupWiseUsersCount()
    {
        $data = DB::table('groups')
            ->leftJoin('user_group_mappings', 'user_group_mappings.group_id', '=', 'groups.id')
            ->select('groups.group_name', DB::raw('COUNT(user_id) as total'), 'groups.id')
            ->groupBy('user_group_mappings.group_id', 'groups.group_name','groups.id')
            ->get();


        return response()->json([
            'success' => true,
            'message' => 'Group Wise Users',
            'data' => $data
        ]);
    }

public function groupWiseUsersList($id)
{
    $userList = DB::table('user_group_mappings as um')
        ->join('users as u', 'um.user_id', '=', 'u.id')
        ->join('groups as g', 'g.id', '=', 'um.group_id')
        ->where('um.group_id', $id)
        ->select('u.id', 'u.name', 'u.email', 'g.group_name')
        ->get();

    return response()->json([
        'success' => true,
        'message' => 'Group Wise User List',
        'data' => $userList
    ]);
}


}
