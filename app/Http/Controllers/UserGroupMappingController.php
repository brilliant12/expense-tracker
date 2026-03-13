<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Group;
use App\Models\UserGroupMapping;

class UserGroupMappingController extends Controller
{

    
    public function create()
    {
        $users = User::where('status','ACTIVE')->select('id','name')->get();
        $groups = Group::where('status','ACTIVE')->select('id','group_name')->get();

        return response()->json([
            'success' => true,
            'users' => $users,
            'groups' => $groups
        ]);
    }

    // store mapping
    public function store(Request $request)
    {
        $request->validate([
            'group_id' => 'required',
            'user_ids' => 'required|array'
        ]);

        foreach ($request->user_ids as $userId) {

            UserGroupMapping::updateOrCreate(
                [
                    'user_id' => $userId,
                    'group_id' => $request->group_id
                ],
                [
                    'status' => 'ACTIVE'
                ]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Users assigned to group successfully'
        ]);
    }

}