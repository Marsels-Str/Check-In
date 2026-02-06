import { useT } from '@/lib/t';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Form, Head, router } from '@inertiajs/react';

export default function CreateLanguage() {
    const t = useT();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumb.languages'), href: '/languages' },
        { title: t('breadcrumb.languages.create'), href: '/languages' },
    ];

    const languagesBack = () => {
        router.get(route('languages.index'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('languages.create.title')} />
            <meta name="description" content="Create a new language for the application" />

            <div className="mx-auto space-y-10">
                <div>
                    <h2 className="text-xl font-bold dark:text-white">{t('languages.create.label')}</h2>
                    <p className="text-sm text-muted-foreground">{t('languages.create.text')}</p>
                </div>

                <Form
                    method="post"
                    action={route('languages.store')}
                    className="rounded-xl border bg-background p-6 shadow-xl"
                >
                    {({ errors }) => (
                        <div className="space-y-2">
                            <div>
                                <Label htmlFor="name">{t('languages.create.name')}</Label>
                                <Input id="name" name="name" />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <Label htmlFor="code">{t('languages.create.code')}</Label>
                                <Input id="code" name="code" />
                                <InputError message={errors.code} />
                            </div>

                            <div className="flex justify-between">
                                <Button type="button" variant="outline" onClick={() => languagesBack()}>
                                    {t('languages.create.back')}
                                </Button>

                                <Button variant="default">{t('languages.create.create')}</Button>
                            </div>
                        </div>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
