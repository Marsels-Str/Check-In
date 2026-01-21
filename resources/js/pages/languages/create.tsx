import { useT } from '@/lib/t';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Form, Head, Link } from '@inertiajs/react';

export default function CreateLanguage() {
    const t = useT();
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumb.languages'), href: '/languages' },
        { title: t('breadcrumb.languages.create'), href: '/languages' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('languages.create.title')} />

            <div className="mx-auto max-w-md space-y-8">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold dark:text-white">{t('languages.create.label')}</h2>
                    <p className="text-sm text-muted-foreground">{t('languages.create.text')}</p>
                </div>

                <Form
                    method="post"
                    action={route('languages.store')}
                    className="rounded-xl border border-border/40 bg-background/60 p-6 shadow-sm backdrop-blur-sm transition hover:border-border/70 dark:border-white/10 dark:bg-[#0f0f0f]/60"
                >
                    {({ errors }) => (
                        <div className="space-y-5">
                            <div className="grid gap-2">
                                <Label htmlFor="name">{t('languages.create.name')}</Label>
                                <Input id="name" name="name" />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="code">{t('languages.create.code')}</Label>
                                <Input id="code" name="code" />
                                <InputError message={errors.code} />
                            </div>

                            <div className="flex items-center justify-between gap-3 pt-4">
                                <Link
                                    href={route('languages.index')}
                                    className="inline-flex items-center rounded-lg border border-border/60 bg-background px-3.5 py-1.5 text-sm font-medium text-muted-foreground shadow-sm transition hover:bg-muted"
                                >
                                    {t('languages.create.back')}
                                </Link>

                                <Button
                                    type="submit"
                                    className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                                >
                                    {t('languages.create.create')}
                                </Button>
                            </div>
                        </div>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
