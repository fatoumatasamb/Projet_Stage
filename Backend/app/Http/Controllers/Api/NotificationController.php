<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = $request->user()->notifications()->latest()->limit(30)->get();

        return response()->json([
            'notifications' => $notifications,
            'non_lues' => $notifications->whereNull('lu_at')->count(),
        ]);
    }

    public function marquerLu(Request $request, Notification $notification)
    {
        abort_if($notification->user_id !== $request->user()->id, 403);

        $notification->update(['lu_at' => now()]);

        return response()->json($notification);
    }

    public function marquerToutesLues(Request $request)
    {
        $request->user()->notifications()->whereNull('lu_at')->update(['lu_at' => now()]);

        return response()->json(['message' => 'Toutes les notifications ont été marquées comme lues.']);
    }
}