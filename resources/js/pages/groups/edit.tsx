import { useT } from '@/lib/t';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BreadcrumbItem, Group } from '@/types';
import InputError from '@/components/input-error';
import { Form, Head, router } from '@inertiajs/react';

export default function Edit({ group }: { group: Group }) {
    const t = useT();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumb.groups'), href: '/groups' },
        { title: t('breadcrumb.groups.edit'), href: '/groups' },
    ];

    const groupsBack = () => {
        router.get(route('groups.index'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('groups.edit.title')}: ${group.name}`} />
            <meta name="description" content="Edit a group" />

            <div className="space-y-2 p-2">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-xl font-bold dark:text-white">{t('groups.edit.label')}</h1>
                        <p className="text-sm text-muted-foreground">{t('groups.edit.text')}</p>
                    </div>

                    <Button variant="outline" onClick={() => groupsBack()}>
                        {t('groups.edit.back')}
                    </Button>
                </div>

                <Form
                    method="put"
                    action={route('groups.update', group.id)}
                    className="mx-auto max-w-md rounded-xl border bg-background p-4 shadow-xl"
                >
                    {({ errors }) => (
                        <>
                            <div>
                                <Label htmlFor="name">{t('groups.edit.name')}</Label>
                                <Input id="name" type="text" name="name" defaultValue={group.name} />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <Label htmlFor="description">{t('groups.edit.description')}</Label>
                                <Input id="description" type="text" name="description" defaultValue={group.description} />
                                <InputError message={errors.description} />
                            </div>

                            <div className="flex justify-center p-2">
                                <Button variant="default">
                                    {t('groups.edit.save')}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
