import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
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
            <Head title="Group Edit"/>
                <div>
                    <Link
                        href={route('job-groups.index')}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Back
                    </Link>
                </div>

                <form onSubmit={submit}>
                        <div className="border border-gray-400 text-center rounded-lg mx-auto max-w-md">

                            <div className='px-4'>
                                <label htmlFor="name" className="block py-2 text-gray-400">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder='Name'
                                    className="border border-gray-400 w-full rounded-lg"/>
                                {errors.name && <div className="text-red-500">{errors.name}</div>}
                            </div>

                            <div className='px-4'>
                                <label htmlFor="description" className="block py-2 text-gray-400">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder='Description'
                                    className="border border-gray-400 w-full rounded-lg"/>
                                {errors.description && <div className="text-red-500">{errors.description}</div>}
                            </div>

                        <div className="text-center py-4">
                            <button
                                type="submit"
                                className=" py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Save
                            </button>
                        </div>

                    </div>
                </form>
        </AppLayout>
    );
}
