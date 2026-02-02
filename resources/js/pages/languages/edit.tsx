import { useT } from '@/lib/t';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { BreadcrumbItem, Language } from '@/types';

interface Props {
    language: Language;
}

export default function EditLanguage({ language }: Props) {
    const t = useT();
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumb.languages'), href: '/languages' },
        { title: t('breadcrumb.languages.edit'), href: '/languages' },
    ];

    const translationsIndex = () => {
        router.get(route('languages.index'))
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('languages.edit.title')} />
            <meta name="description" content="Edit an existing language and its details" />

            <div className="mx-auto max-w-md space-y-8">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold dark:text-white">{t('languages.edit.label')}</h2>
                    <p className="text-sm text-muted-foreground">{t('languages.edit.text')}</p>
                </div>

                <Form
                    method="put"
                    action={route('languages.update', language.id)}
                    className="rounded-xl border border-border/40 bg-background/60 p-6 shadow-sm backdrop-blur-sm transition hover:border-border/70 dark:border-white/10 dark:bg-[#0f0f0f]/60"
                >
                    {({ errors }) => (
                        <div className="space-y-5">
                            <div className="grid gap-2">
                                <Label htmlFor="name">{t('languages.edit.name')}</Label>
                                <Input id="name" name="name" defaultValue={language.name} />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="code">{t('languages.edit.code')}</Label>
                                <Input id="code" name="code" defaultValue={language.code} />
                                <InputError message={errors.code} />
                            </div>

                            <div className="flex items-center justify-between gap-3 pt-4">
                                <Button
                                    onClick={() => translationsIndex()}
                                    type="button"
                                    className="inline-flex items-center rounded-lg border border-border/60 bg-background px-3.5 py-1.5 text-sm font-medium text-muted-foreground shadow-sm transition hover:bg-muted"
                                >
                                    {t('languages.edit.back')}
                                </Button>

                                <Button
                                    type="submit"
                                    className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 disabled:opacity-50 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                                >
                                    {t('languages.edit.save')}
                                </Button>
                            </div>
                        </div>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
