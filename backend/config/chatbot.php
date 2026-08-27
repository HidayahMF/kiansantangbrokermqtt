<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Chatbot dataset
    |--------------------------------------------------------------------------
    |
    | Path to the JSON dataset used by the chatbot. The file must be a JSON
    | array of objects shaped as: { "keywords": ["..."], "reply": "..." }.
    | It can be overridden via the CHATBOT_DATASET environment variable.
    |
    */

    'dataset_path' => env('CHATBOT_DATASET', base_path('dataset/chatbot_dataset.json')),
];