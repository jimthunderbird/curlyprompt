<?php

namespace App\Http\Controllers;

class IndexController extends Controller
{
    public function __invoke()
    {
        $loggedIn = auth()->check();

        return view('index', ['loggedIn' => $loggedIn]);
    }
}
