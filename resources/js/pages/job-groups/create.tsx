import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Groups', href: '/job-groups' },
    { title: 'Create Group', href: '/job-groups/create' },
];

type FormData = {
    name: string;
    description: string;
    business_id: string | number | null;
};

export default function Create({ businesses, auth }: { businesses: any[]; auth: any }) {
    const isOwner = auth.user.roles.some((r: any) => r.name === 'Owner');

    const { data, setData, post, processing, errors } = useForm<FormData>({
        name: '',
        description: '',
        business_id: isOwner ? '' : (auth.user.ownedBusiness?.id ?? auth.user.business_id ?? null),
    });

    function submit(e: React.SyntheticEvent) {
        e.preventDefault();
        post(route('job-groups.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Job Group" />

            <div>
                <Link
                    href={route('job-groups.index')}
                    className="inline-flex items-center rounded border border-transparent bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700"
                >
                    Back
                </Link>

                <form onSubmit={submit} className="mx-auto mt-6 w-full max-w-md space-y-6">
                    <div className="space-y-3 rounded-md border px-4 py-5 shadow-sm sm:p-6">
                        <label htmlFor="name" className="block text-center text-sm font-medium">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="block w-full rounded-md border"
                        />
                        {errors.name && <div className="text-center text-sm text-red-600">{errors.name}</div>}
                    </div>

                    <div className="space-y-3 rounded-md border px-4 py-5 shadow-sm sm:p-6">
                        <label htmlFor="description" className="block text-center text-sm font-medium">
                            Description
                        </label>
                        <input
                            type="text"
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="block w-full rounded-md border"
                        />
                        {errors.description && <div className="text-center text-sm text-red-600">{errors.description}</div>}
                    </div>

                    {isOwner && (
                        <div className="space-y-3 rounded-md border px-4 py-5 shadow-sm sm:p-6">
                            <label htmlFor="business_id" className="block text-center text-sm font-medium">
                                Business
                            </label>
                            <select
                                id="business_id"
                                value={data.business_id || ''}
                                onChange={(e) => setData('business_id', e.target.value)}
                                className="block w-full rounded-md border bg-gray-400"
                            >
                                <option value="">Select business</option>
                                {businesses.map((b: any) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                            {errors.business_id && <div className="text-center text-sm text-red-600">{errors.business_id}</div>}
                        </div>
                    )}

                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex justify-center rounded-md border bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
