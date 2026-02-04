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

            <div className="mx-auto space-y-10">
                <div>
                    <h2 className="text-xl font-bold dark:text-white">{t('languages.edit.label')}</h2>
                    <p className="text-sm text-muted-foreground">{t('languages.edit.text')}</p>
                </div>

                <Form
                    method="put"
                    action={route('languages.update', language.id)}
                    className="rounded-xl border bg-background p-6 shadow-xl dark:border-white dark:bg-background"
                >
                    {({ errors }) => (
                        <div className="space-y-2">
                            <div>
                                <Label htmlFor="name">{t('languages.edit.name')}</Label>
                                <Input id="name" name="name" defaultValue={language.name} />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <Label htmlFor="code">{t('languages.edit.code')}</Label>
                                <Input id="code" name="code" defaultValue={language.code} />
                                <InputError message={errors.code} />
                            </div>

                            <div className="flex justify-between">
                                <Button type="button" variant="outline" onClick={() => translationsIndex()}>
                                    {t('languages.edit.back')}
                                </Button>

                                <Button variant="default">
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
