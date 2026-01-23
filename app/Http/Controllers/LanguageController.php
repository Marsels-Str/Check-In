<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Languages;
use App\Models\Originals;
use Illuminate\Http\Request;
use App\Jobs\TranslateOriginalJob;
use Illuminate\Support\Facades\Bus;
use App\Services\TranslationRegistry;

class LanguageController extends Controller
{
    public function index(TranslationRegistry $translations)
    {
        $translations->registerPage('originals');

        $user = auth()->user();

        $originals = Originals::count();

        $languages = Languages::withCount([
            'translations as translated_count' => function ($q) {
                $q->whereNotNull('translation')
                ->where('translation', '!=', '');
            }
        ])
        ->orderBy('name')
        ->get();

        return Inertia::render('languages/index', [
            'languages' => $languages,
            'originals' => $originals,
            'last_batch' => session('last_batch'),
        ]);
    }

    public function create()
    {
        return Inertia::render('languages/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'code' => 'required|string|max:10|unique:languages,code',
        ]);

        Languages::create([
            'name' => $request->name,
            'code' => strtolower($request->code),
        ]);

        return redirect()->route('languages.index')->with('success', 'Language created successfully!');
    }

    public function edit(Languages $language)
    {
        return Inertia::render('languages/edit', compact('language'));
    }

    public function update(Request $request, Languages $language)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'code' => 'required|string|max:10|unique:languages,code,' . $language->id,
        ]);

        $language->update([
            'name' => $request->name,
            'code' => strtolower($request->code),
        ]);

        return redirect()->route('languages.index')->with('success', 'Language updated successfully!');
    }

    public function destroy(Languages $language)
    {
        $language->delete();

        return redirect()->route('languages.index')->with('success', 'Language deleted successfully!');
    }

    public function start(Languages $language)
    {
        if ($language->code === 'en') {
            return back();
        }

        if ($language->translation_batch_id) {
            $existing = Bus::findBatch($language->translation_batch_id);

            if ($existing && ! $existing->finished()) {
                return back()->with('error', 'Translation in progress, please wait!');
            }

            $language->update(['translation_batch_id' => null]);
        }

        $jobs = [];

        $originals = Originals::all();

        foreach ($originals as $original) {
            $alreadyTranslated = $original->translations()
                ->where('languages_id', $language->id)
                ->exists();

            if ($alreadyTranslated) {
                continue;
            }

            $delayPerJob = 2;
            
            $jobs[] = (new TranslateOriginalJob(
                $original->id,
                $language->id,
                $language->code
            ))->delay($delayPerJob * count($jobs));
        }

        if (empty($jobs)) {
            return back();
        }

        $batch = Bus::batch($jobs)
            ->name("Sync translations for {$language->code}")
            ->onQueue('text-translation')
            ->dispatch();

        $language->update([
            'translation_batch_id' => $batch->id,
        ]);

        return redirect()->route('languages.index')->with('success', 'Synchronization started, please wait!');
    }

    public function switch(Request $request)
    {
        $lang = $request->language;

        session(['language' => $lang]);

        cookie()->queue('lang', $lang, 60 * 24  *365);

        return redirect()->to(url()->previous());
    }
}
