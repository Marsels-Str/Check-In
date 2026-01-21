<?php

namespace App\Http\Middleware;

use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use App\Models\Languages;
use App\Models\Originals;
use Illuminate\Http\Request;
use App\Models\Translations;
use Illuminate\Foundation\Inspiring;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $user = $request->user();
        $user = $user ? $user->load('profile', 'business.Groups', 'business.maps') : null;
        $roles = $user ? $user->getRoleNames()->toArray() : [];

        $locale = app()->getLocale();

        $originals = Originals::pluck('text', 'key')->toArray();

        $translations = [];

        if ($locale !== 'en') {
            $language = Languages::where('code', $locale)->first();

            if ($language) {
                $translations = Translations::where('languages_id', $language->id)
                    ->with('original:id,key')
                    ->get()
                    ->mapWithKeys(fn ($t) => [
                        $t->original->key => $t->translation,
                    ])
                    ->toArray();
            }
        }

        return [
            ...parent::share($request),
            'translation' => [
                'locale' => $locale,
                'originals' => $originals,
                'translations' => $translations,
            ],
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user ? array_merge($user->toArray(), ['roles' => $roles]) : null,
                'permissions' => fn () => $request->user()?->getAllPermissions()->pluck('name') ?? [],
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
