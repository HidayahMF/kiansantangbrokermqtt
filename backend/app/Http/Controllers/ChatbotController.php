<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ChatbotController
{
    /**
     * Return a keyword-matched chatbot reply.
     */
    public function reply(Request $request)
    {
        $message = strtolower((string) $request->input('message'));

        $reply = $this->getBotReply($message);

        return response()->json(['reply' => $reply]);
    }

    private function getBotReply(string $message): string
    {
        $path = config('chatbot.dataset_path');
        $dataset = $this->loadDataset($path);

        foreach ($dataset as $data) {
            if (!isset($data['keywords'], $data['reply']) || !is_array($data['keywords'])) {
                continue;
            }

            foreach ($data['keywords'] as $keyword) {
                if (strpos($message, strtolower((string) $keyword)) !== false) {
                    return $data['reply'];
                }
            }
        }

        return "Maaf, aku belum tahu tentang itu 😅. Coba tanyakan tentang emisi karbon atau efek rumah kaca!";
    }

    private function loadDataset(string $path): array
    {
        if (!is_file($path)) {
            abort(503, 'Chatbot dataset is not available.');
        }

        $contents = file_get_contents($path);
        $dataset = json_decode((string) $contents, true);

        if (!is_array($dataset)) {
            abort(503, 'Chatbot dataset is not available.');
        }

        return $dataset;
    }
}