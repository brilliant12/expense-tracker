<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\ExpenseSummary;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Log\Logger;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ExpenseController extends Controller
{
    // Store expense
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'expense_name'        => 'required|string|max:255',
            'group_id'            => 'required|numeric',
            'expense_description' => 'required|string',
            'amount'              => 'required|numeric',
            'status'              => 'required|in:ACTIVE,INACTIVE',
        ]);
     
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
            ], 422);
        }

        $expense = null;

        DB::transaction(function () use ($request, &$expense) {

        if ($request->hasFile('upload_expense_doc')) {
    $file = $request->file('upload_expense_doc');
    $filename = time().'_'.$file->getClientOriginalName();
    $path = $file->storeAs('expense_docs', $filename, 'public');
    $upload_expense_doc = $path;
  
}


            $expense = Expense::create([
                'expense_name'        => $request->expense_name,
                'group_id'            => $request->group_id,
                'expense_description' => $request->expense_description,
                'amount'              => $request->amount,
                'status'              => $request->status,
                'expense_doc'  =>$upload_expense_doc??null,
                'user_id'             => auth()->id(),
            ]);



            $month = now()->startOfMonth()->toDateString();

            $summary = ExpenseSummary::where('group_id', $request->group_id)
                ->where('user_id', auth()->id())
                ->where('month', $month)
                ->lockForUpdate()
                ->first();

            if ($summary) {
                $summary->total_amount += $request->amount;
                $summary->save();
            } else {
                ExpenseSummary::create([
                    'group_id'     => $request->group_id,
                    'user_id'      => auth()->id(),
                    'month'        => $month,
                    'total_amount' => $request->amount,
                ]);
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Expense added successfully!',
            'data'    => $expense,
        ]);
    }


    // Get list of expenses
  public function index()
{
    $expenses = Expense::where('user_id', auth()->id())
        ->with('group:id,group_name')
        ->get()
        ->map(function ($expense) {
            return [
                'id' => $expense->id,
                'expense_name' => $expense->expense_name,
                'group' => $expense->group->group_name,
                'expense_description' => $expense->expense_description,
                'amount' => $expense->amount,
                'status' => $expense->status,
                'created_at' => $expense->created_at_formatted,
                'updated_at' => $expense->updated_at_formatted,
                'upload_expense_doc_url' => $expense->expense_doc
                    ? asset('storage/' . $expense->expense_doc)
                    : null,
            ];
        });

    return response()->json([
        'success' => true,
        'data' => $expenses,
    ]);
}


    // Get a single expense detail
    public function show($id)
    {
        $expense = Expense::with('group:id,group_name', 'user:id,name')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $expense,
        ]);
    }

    public function update(Request $request, $id)
    {
        Log::info('Expense Update Request:', $request->all());

        $validator = Validator::make($request->all(), [
            'expense_name'        => 'required|string|max:255',
            'group_id'            => 'required|numeric',
            'expense_description' => 'required|string|max:255',
            'amount'              => 'required|numeric|min:0.001',
            'status'              => 'required|in:ACTIVE,INACTIVE',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
            ], 422);
        }

        $expense = Expense::where('user_id', auth()->id())->findOrFail($id);

        DB::transaction(function () use ($request, $expense) {
            $oldAmount = $expense->amount;

            // Update expense fields
            $expense->expense_name        = $request->expense_name;
            $expense->group_id            = $request->group_id;
            $expense->expense_description = $request->expense_description;
            $expense->amount              = $request->amount;
            $expense->status              = $request->status;
            $expense->save();

            $month = $expense->created_at->copy()->startOfMonth()->toDateString();
            $diff  = $request->amount - $oldAmount;

            $summary = ExpenseSummary::where('group_id', $request->group_id)
                ->where('user_id', auth()->id())
                ->where('month', $month)
                ->lockForUpdate()
                ->first();

            if ($summary) {
                $summary->total_amount += $diff;
                $summary->save();
            } else {
                ExpenseSummary::create([
                    'group_id'     => $request->group_id,
                    'user_id'      => auth()->id(),
                    'month'        => $month,
                    'total_amount' => $request->amount,
                ]);
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Expense updated successfully!',
            'data'    => $expense,
        ]);
    }


    public function groupMaster()
    {
        $authId = auth()->user()->id;
        $userGroups = DB::table('user_group_mappings as um')
            ->join('groups as g', 'um.group_id', '=', 'g.id')
            ->where('um.user_id', $authId)
            ->select('g.group_name', 'g.id')
            ->get();
        return response()->json([
            'success' => 'true',
            'message' => 'Group Master List',
            'data'   => $userGroups
        ]);
    }

    public function group_detail_with_each_expense($id)
    {
        $groupDetails = Group::where('id', $id)->first();

        $expenseList = DB::table('expenses as e')
            ->join('users as u', 'e.user_id', '=', 'u.id')
            ->where('e.group_id', $id)
            ->select('e.*', 'u.name')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Group Details and all expenses in the Group',
            'data' => [
                'expenseList' => $expenseList,
                'groupDetail' => $groupDetails
            ]
        ]);
    }
    public function destroy($id)
    {
        $expense = Expense::where('user_id', auth()->id())->findOrFail($id);

        DB::transaction(function () use ($expense) {
            $month = $expense->created_at->copy()->startOfMonth()->toDateString();


            $summary = ExpenseSummary::where('group_id', $expense->group_id)
                ->where('user_id', auth()->id())
                ->where('month', $month)
                ->lockForUpdate()
                ->first();

            if ($summary) {

                $summary->total_amount -= $expense->amount;


                if ($summary->total_amount <= 0) {
                    $summary->delete();
                } else {
                    $summary->save();
                }
            }


            $expense->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Expense deleted successfully!',
        ]);
    }
}
