<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    protected $task;

    protected $with = ['userId'];

    public function __construct(Task $task)
    {
        $this->task = $task;
    }

    public function index(Request $request)
    {
        $user_id = $request->userId;
        $page = $request->page;
        $limit = $request->limit;
        $filters = $request->filters;
        $sortField = $request->sortField ? $request->sortField : 'id';
        $sortOrder = $request->sortOrder === -1 ? 'desc' : 'asc';

        try {

            $tasks = $this->task::with($this->with)->where('user_id', $user_id);

            foreach($filters as $field => $filter){
                if(isset($filter['matchMode']) && isset($filter['value'])) {
                    $matchMode = $filter['matchMode'];
                    $value = $filter['value'];

                    if($field === 'global'){
                        $tasks->where(function($query) use($value) {
                            $query->where('title', 'like', '%'.$value.'%')
                                ->orWhere('description', 'like', '%'.$value.'%');
                        });
                        continue;
                    }

                    if($matchMode === 'equals') {
                        $tasks->where($field, $value);
                    } else if($matchMode === 'contains') {
                        $tasks->where($field, 'like', '%'.$value.'%');
                    } else if($matchMode === 'startsWith') {
                        $tasks->where($field, 'like', $value.'%');
                    } else if($matchMode === 'endsWith') {
                        $tasks->where($field, 'like', '%'.$value);
                    }
                }
            }

            $tasks->orderBy($sortField, $sortOrder);

            $tasks = $tasks->paginate($limit, ['*'], 'page', $page);

            return response()->json([
                'status' => 200,
                'message' => 'Tasks fetched successfully',
                'tasks' => $tasks,
                'total' => $tasks->total()
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'status' => 500,
                'message' => $e->getMessage()
            ], 500);

        }
    }

    public function store(Request $request)
    {
        $data = $request->all();

        try {

            $task = $this->task->create($data);

            return response()->json([
                'status' => 200,
                'message' => 'Task created successfully',
                'task' => $task
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'status' => 500,
                'message' => $e->getMessage()
            ], 500);

        }
    }

    public function show($id)
    {
        try {

            $task = $this->task::with($this->with)->find($id);

            return response()->json([
                'status' => 200,
                'message' => 'Task fetched successfully',
                'task' => $task
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'status' => 500,
                'message' => $e->getMessage()
            ], 500);

        }
    }

    public function update(Request $request, $id)
    {
        $data = $request->all();

        try {

            $task = $this->task->find($id);
            $task->update($data);

            return response()->json([
                'status' => 200,
                'message' => 'Task updated successfully',
                'task' => $task
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'status' => 500,
                'message' => $e->getMessage()
            ], 500);

        }
    }

    public function destroy($id)
    {
        try {

            $task = $this->task->find($id);
            $task->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Task deleted successfully'
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'status' => 500,
                'message' => $e->getMessage()
            ], 500);

        }
    }
}
