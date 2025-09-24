import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Groups',
        href: '/job-groups',
    },
    {
        title: 'Create Group',
        href: '/job-groups',
    },
];

export default function Create() {

    const { data, setData, post, errors } = useForm({
        name: '',
        description: '',
    });

    function submit(e: React.SyntheticEvent) {
        e.preventDefault();
        post(route('job-groups.store')); 
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Role Create"/>
                <div>
                    <Link
                        href={route('job-groups.index')}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Back
                    </Link>

                    <form onSubmit={submit} className="space-y-6 mx-auto w-full max-w-md">
                        <div className="space-y-3 border border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6 rounded-md shadow-sm">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-center">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder='Name'
                                className="border focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md sm:text-sm"
                            />
                            {errors.name && <div className="text-sm text-red-600 text-center">{errors.name}</div>}
                        </div>

                        <div className="space-y-3 border border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6 rounded-md shadow-sm">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-center">
                                Description
                            </label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder='Description'
                                className="border focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md sm:text-sm"
                            />
                            {errors.description && <div className="text-sm text-red-600 text-center">{errors.description}</div>}
                        </div>

                        <div className="text-center">
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            
        </AppLayout>
    );
}
