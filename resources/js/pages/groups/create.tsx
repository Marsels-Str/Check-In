import { useT } from '@/lib/t';
import { useCan } from '@/lib/can';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Head, useForm, router } from '@inertiajs/react';
import { BreadcrumbItem, BusinessProfile } from '@/types';
import BusinessDropdownMenu from '@/components/business-dropdown-menu';

type FormData = {
    name: string;
    description: string;
    business_id: number | null;
};

interface Props {
    businesses: BusinessProfile[];
    auth: any;
}

export default function Create({ businesses, auth }: Props) {
    const canAccess = useCan('business.access');

    const { data, setData, post, errors } = useForm<FormData>({
        name: '',
        description: '',
        business_id: canAccess ? null : (auth.user.ownedBusiness?.id ?? auth.user.business_id ?? null),
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

    const groupsBack = () => {
        router.get(route('groups.index'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('groups.create.title')} />
            <meta name="description" content="Create a new group" />

            <div className="space-y-2 p-2">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('groups.create.label')}</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('groups.create.text')}</p>
                    </div>

                    <Button variant="outline" onClick={() => groupsBack()}>
                        {t('groups.create.back')}
                    </Button>
                </div>

                <form
                    onSubmit={submit}
                    className="mx-auto max-w-md rounded-xl border bg-background p-4 shadow-xl space-y-2"
                >
                    <div>
                        <Label htmlFor="name" className="dark:text-white">
                            {t('groups.create.name')}
                        </Label>
                        <Input type="text" id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Label htmlFor="description" className="dark:text-white">
                            {t('groups.create.description')}
                        </Label>
                        <Input type="text" id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                        <InputError message={errors.description} />
                    </div>

                    {canAccess && (
                        <div className="flex justify-center">
                            <BusinessDropdownMenu businesses={businesses} selectedBusinessId={null} onChange={(id) => setData('business_id', id)} />
                        </div>
                    )}

                    <div className="flex justify-center p-2">
                        <Button variant="default">
                            {t('groups.create.save')}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
