import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role Create',
        href: '/roles',
    },
];

export default function Create({ permissions }: { permissions: string[] }) {

    const { data, setData, post, errors } = useForm({
        name: '',
        permissions: [] as string[],
    });

    function handleCheckboxChange(permissionName: string, isChecked: boolean) {
        if (isChecked) {
            setData('permissions', [...data.permissions, permissionName]);
        } else {
            setData('permissions', data.permissions.filter(name => name !== permissionName));
        }
    }

    function submit(e: React.SyntheticEvent) {
        e.preventDefault();
        post(route('roles.store')); 
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Role Create"/>
                <div>
                    <Link
                        href={route('roles.index')}
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
                            <label htmlFor="permissions" className="block text-sm font-medium text-gray-700 text-center">
                                Permissions:
                            </label>

                            <ul className="list-inside list-disc">
                                {permissions.map((permission) => 
                                    <li key={permission} className="flex items-center">
                                        <input
                                            id='permissions'
                                            type="checkbox"
                                            value={permission}
                                            onChange={(e) => handleCheckboxChange(permission, e.target.checked)}
                                            className='form-checkbox rounded mr-2'
                                        />
                                        <span>{permission}</span>
                                    </li>
                                )}
                            </ul>

                            {errors.permissions && <div className="text-sm text-red-600 text-center">{errors.permissions}</div>}
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
