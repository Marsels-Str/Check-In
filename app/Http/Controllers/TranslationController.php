<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Languages;
use App\Models\Originals;
use App\Models\Translations;
use Illuminate\Http\Request;

class TranslationController extends Controller
{
    public function index(Languages $language)
    {
        $originals = Originals::with(['translations' => function ($q) use ($language) {
            $q->where('languages_id', $language->id);
        }])->orderBy('key')->get();

        $rows = $originals->map(function ($original) use ($language) {
            $parts = explode('.', $original->key);

            $group = $parts[0] ?? '';
            $view  = $parts[1] ?? '';
            $field = implode('.', array_slice($parts, 2));

            $translation = optional(
                $original->translations->first()
            )->translation;

            return [
                'id'          => $original->id,
                'key'         => $original->key,
                'group'       => $group,
                'view'        => $view,
                'field'       => $field,
                'original'    => $original->text,
                'translation' => $translation ?? '',
            ];
        });

        return Inertia::render('translations/index', [
            'language' => $language,
            'rows'   => $rows,
        ]);
    }

    public function edit(Request $request, Languages $language, Originals $original)
    {
        $translation = Translations::firstOrNew([
            'originals_id' => $original->id,
            'languages_id'   => $language->id,
        ]);

        $translation->setRelation('original', $original);

        return Inertia::render('translations/edit', compact('language', 'original', 'translation'));
    }

    public function update(Request $request, Languages $language, Originals $original)
    {
        $request->validate([
            'translation' => 'required|string'
        ]);

        Translations::updateOrCreate(
            [
                'originals_id' => $original->id,
                'languages_id' => $language->id
            ],
            [
                'translation' => $request->translation
            ]
        );

        return redirect()->route('translations.index', $language->id)->with('success', 'Translation updated successfully!');
    }
}
