import { useT } from '@/lib/t';
import AppLayout from '@/layouts/app-layout';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Form, Head, Link } from '@inertiajs/react';
import { BreadcrumbItem, Language, Translation } from '@/types';

interface Props {
    language: Language;
    translation: Translation;
}

export default function EditTranslation({ language, translation }: Props) {
    const t = useT();
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumb.languages'), href: '/languages' },
        { title: t('breadcrumb.languages.translations'), href: route('translations.index', language.id) },
        { title: t('breadcrumb.languages.edit'), href: '/languages' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('translations.edit.title')} />
            <meta name="description" content="Edit a translation for the selected language" />

            <div className="mx-auto max-w-md space-y-8">
                <div className="space-y-1">
                    <h2 className="text-lg font-bold dark:text-white">{t('translations.edit.label')}</h2>
                </div>

                <Form
                    method="put"
                    action={route('translations.update', [language.id, translation.original.id])}
                    className="rounded-xl border border-border/40 bg-background/60 p-6 shadow-sm backdrop-blur-sm transition hover:border-border/70 dark:border-white/10 dark:bg-[#0f0f0f]/60"
                >
                    {({ errors }) => (
                        <div className="space-y-5">
                            <div className="space-y-1">
                                <strong className="text-sm dark:text-white">{t('translations.edit.key')}</strong>
                                <p className="text-sm break-all text-muted-foreground">{translation.original.key}</p>
                            </div>

                            <div className="space-y-1">
                                <strong className="text-sm dark:text-white">{t('translations.edit.original')}</strong>
                                <p className="text-sm whitespace-pre-wrap text-muted-foreground">{translation.original.text}</p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="translation">{t('translations.edit.translation')}</Label>

                                <textarea
                                    id="translation"
                                    name="translation"
                                    rows={4}
                                    defaultValue={translation.translation ?? ''}
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                                />

                                <InputError message={errors.translation} />
                            </div>

                            <div className="flex items-center justify-between gap-3 pt-4">
                                <Link
                                    href={route('translations.index', language.id)}
                                    className="inline-flex items-center rounded-lg border border-border/60 bg-background px-3.5 py-1.5 text-sm font-medium text-muted-foreground shadow-sm transition hover:bg-muted"
                                >
                                    {t('translations.edit.back')}
                                </Link>

                                <Button
                                    type="submit"
                                    className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                                >
                                    {t('translations.edit.save')}
                                </Button>
                            </div>
                        </div>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
