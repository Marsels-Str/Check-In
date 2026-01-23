import { useT } from '@/lib/t';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import { Form, Head, Link } from '@inertiajs/react';

export default function Edit({ group }: { group: any }) {
    const t = useT();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumb.groups'), href: '/groups' },
        { title: t('breadcrumb.groups.edit'), href: '/groups' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('groups.edit.title')}: ${group.name}`} />

            <div className="px-4">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('groups.edit.label')}</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('groups.edit.text')}</p>
                    </div>

                    <Link
                        href={route('groups.index')}
                        className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                    >
                        {t('groups.edit.back')}
                    </Link>
                </div>

                <Form
                    method="put"
                    action={route('groups.update', group.id)}
                    className="mx-auto w-full max-w-md space-y-6 rounded-xl border border-gray-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm"
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

                            <div className="flex justify-end pt-2">
                                <Button
                                    type="submit"
                                    className="inline-flex items-center rounded-lg bg-pink-200/20 px-4 py-2 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 disabled:opacity-50 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                                >
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
