import { useT } from '@/lib/t';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Label } from '@/components/ui/label';
import { Form, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
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

    const translationsBack = (language: Language) => {
        router.get(route('translations.index', language.id))
    }
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('translations.edit.title')} />
            <meta name="description" content="Edit a translation for the selected language" />

            <div className="mx-auto max-w-md space-y-10">
                <div>
                    <h2 className="text-lg font-bold dark:text-white">{t('translations.edit.label')}</h2>
                </div>

                <Form
                    method="put"
                    action={route('translations.update', [language.id, translation.original.id])}
                    className="rounded-xl border bg-background p-6 shadow-xl dark:bg-background"
                >
                    {({ errors }) => (
                        <div className="space-y-2">
                            <div>
                                <strong className="dark:text-white">{t('translations.edit.key')}</strong>
                                <p className="break-all text-muted-foreground">{translation.original.key}</p>
                            </div>

                            <div>
                                <strong className="dark:text-white">{t('translations.edit.original')}</strong>
                                <p className="whitespace-pre-wrap text-muted-foreground">{translation.original.text}</p>
                            </div>

                            <div>
                                <Label htmlFor="translation">{t('translations.edit.translation')}</Label>

                                <textarea
                                    id="translation"
                                    name="translation"
                                    rows={4}
                                    defaultValue={translation.translation ?? ''}
                                    className="w-full rounded-md border bg-background px-2 py-2"
                                />

                                <InputError message={errors.translation} />
                            </div>

                            <div className="flex justify-between">
                                <Button type="button" variant="outline" onClick={() => translationsBack(language)}>
                                    {t('translations.edit.back')}
                                </Button>

                                <Button variant="default">
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
