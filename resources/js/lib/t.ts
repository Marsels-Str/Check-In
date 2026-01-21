import { usePage } from '@inertiajs/react';

export function useT() {
    const page = usePage<{
        translation?: {
            originals: Record<string, string>;
            translations: Record<string, string>;
        };
    }>();

    const originals = page.props.translation?.originals ?? {};
    const translations = page.props.translation?.translations ?? {};

    function t(key: string, fallback?: string): string {
        return translations[key] ?? originals[key] ?? fallback ?? key;
    }

    return t;
}
