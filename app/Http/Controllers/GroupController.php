<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GroupController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'group_name' => 'required',
                'group_description' => 'required',
                'status' => 'required|in:ACTIVE,INACTIVE',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),

            ], 422);
        }

        $group = Group::create([
            'group_name' => $request->group_name,
            'group_description' => $request->group_description,
            'status' => $request->status,

        ]);

        return response()->json([
            'success' => true,
            'message' => 'Group Added Successfully',
            'data' => $group,
        ]);
    }

    public function list()
    {
        return response()->json(
            ['success' => true, 'message' => 'all Groups', 'data' => Group::all()]
        );
    }

    public function show($id)
    {
        $group = Group::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $group,
        ]);
    }
    public function update(Request $request, $id)
    {



        $validator = Validator::make($request->all(), [
            'group_name'        => 'required|string|max:255',
            'group_description' => 'required|string|max:255',
            'status'              => 'required|in:ACTIVE,INACTIVE',
        ]);


        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
            ], 422);
        }


        $group = Group::findOrFail($id);


        $group->group_name = $request->group_name;

        $group->group_description = $request->group_description;

        $group->status = $request->status;


        $group->save();


        return response()->json([
            'success' => true,
            'message' => 'Group updated successfully!',
            'data' => $group,
        ]);
    }
}
