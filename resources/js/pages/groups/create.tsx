import { useT } from '@/lib/t';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import BusinessDropdownMenu from '@/components/business-dropdown-menu';

type FormData = {
    name: string;
    description: string;
    business_id: string | number | null;
};

export default function Create({ businesses, auth }: { businesses: any[]; auth: any }) {
    const isOwner = auth.user.roles.some((r: any) => r.name === 'Owner');

    const { data, setData, post, errors } = useForm<FormData>({
        name: '',
        description: '',
        business_id: isOwner ? '' : (auth.user.ownedBusiness?.id ?? auth.user.business_id ?? null),
    });

    function submit(e: React.SyntheticEvent) {
        e.preventDefault();
        post(route('groups.store'));
    }

    const t = useT();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumb.groups'), href: '/groups' },
        { title: t('breadcrumb.groups.create'), href: '/groups/create' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('groups.create.title')} />

            <div className="px-4">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('groups.create.label')}</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('groups.create.text')}</p>
                    </div>

                    <Link
                        href={route('groups.index')}
                        className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                    >
                        {t('groups.create.back')}
                    </Link>
                </div>

                <form
                    onSubmit={submit}
                    className="mx-auto w-full max-w-md space-y-6 rounded-xl border border-gray-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm"
                >
                    <div>
                        <Label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('groups.create.name')}
                        </Label>
                        <Input
                            type="text"
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <Label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('groups.create.description')}
                        </Label>
                        <Input
                            type="text"
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                    </div>

                    {isOwner && (
                        <div className="flex justify-center">
                            <BusinessDropdownMenu
                                businesses={businesses}
                                selectedBusinessId={null}
                                onChange={(id) => setData('business_id', id)}
                            />
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <Button
                            type="submit"
                            className="inline-flex items-center rounded-lg bg-pink-200/20 px-4 py-2 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 disabled:opacity-50 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                        >
                            {t('groups.create.save')}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
