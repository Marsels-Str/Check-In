import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Groups',
        href: '/job-groups',
    },
    {
        title: 'Edit Group',
        href: '/job-groups',
    },
];

export default function Edit({ group }: { group: any }) {
    type UserFormData = {
        name: string;
        description: string;
    };

    const { data, setData, put, errors } = useForm<UserFormData>({
        name: group.name || '',
        description: group.description || '',
    });

    function submit(e: React.SyntheticEvent) {
        e.preventDefault();
        put(route('job-groups.update', group.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Group Edit" />
            <div>
                <Link
                    href={route('job-groups.index')}
                    className="inline-flex items-center rounded border border-transparent bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                    Back
                </Link>
            </div>

            <form onSubmit={submit}>
                <div className="mx-auto max-w-md rounded-lg border border-gray-400 text-center">
                    <div className="px-4">
                        <label htmlFor="name" className="block py-2 text-gray-400">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Name"
                            className="w-full rounded-lg border border-gray-400"
                        />
                        {errors.name && <div className="text-red-500">{errors.name}</div>}
                    </div>

                    <div className="px-4">
                        <label htmlFor="description" className="block py-2 text-gray-400">
                            Description
                        </label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Description"
                            className="w-full rounded-lg border border-gray-400"
                        />
                        {errors.description && <div className="text-red-500">{errors.description}</div>}
                    </div>

                    <div className="py-4 text-center">
                        <button
                            type="submit"
                            className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
