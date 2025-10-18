<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ChatbotController
{
    /**
     * Display a listing of the resource.
     */

     public function reply(Request $request)
    {
        $message = strtolower($request->input('message'));
        $response = $this->getBotReply($message);

        return response()->json(['reply' => $response]);
    }

    private function getBotReply($message)
    {
        $path = base_path('dataset/chatbot_dataset.json');
        $dataset = json_decode(file_get_contents($path), true);

        foreach ($dataset as $data) {
            foreach ($data['keywords'] as $keyword) {
                if (strpos($message, strtolower($keyword)) !== false) {
                    return $data['reply'];
                }
            }
        }

        return "Maaf, aku belum tahu tentang itu 😅. Coba tanyakan tentang emisi karbon atau efek rumah kaca!";
    }


    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
