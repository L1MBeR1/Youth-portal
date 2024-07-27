<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'auth/vkontakte', 'auth/vkontakte/callback', 'oauth/*'],
    'allowed_methods' => ['*'],
    // 'allowed_origins' => [
    //     '*',
    // ],
    'allowed_origins' => [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://185.242.118.145',
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];


