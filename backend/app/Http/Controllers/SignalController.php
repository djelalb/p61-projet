<?php

namespace App\Http\Controllers;

use App\Models\Signal;

class SignalController extends Controller
{
    public function signal()
    {
        request()->validate([
            'latitude' => 'required',
            'longitude' => 'required',
        ]);

        $signal = auth()->user()->signals()->create([
            'latitude' => request('latitude'),
            'longitude' => request('longitude'),
        ]);


        return response()->json($signal);
    }

    public function getSignals()
    {
        return response()->json(Signal::all());
    }
}
