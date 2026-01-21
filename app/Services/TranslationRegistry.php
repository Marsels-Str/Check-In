<?php

namespace App\Services;

use App\Models\Originals;

class TranslationRegistry
{
    public function registerPage(string $page): void
    {
        $path = app_path("Originals/pages/{$page}.php");

        if (! file_exists($path)) {
            return;
        }

        $translations = require $path;

        if (! is_array($translations)) {
            return;
        }

        foreach ($translations as $key => $text) {
            Originals::firstOrCreate(
                ['key' => $key],
                ['text' => $text]
            );
        }
    }
}
