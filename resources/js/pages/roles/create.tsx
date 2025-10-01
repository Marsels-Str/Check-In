import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
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
            setData(
                'permissions',
                data.permissions.filter((name) => name !== permissionName),
            );
        }
    }

    function submit(e: React.SyntheticEvent) {
        e.preventDefault();
        post(route('roles.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Role Create" />
            <div>
                <Link
                    href={route('roles.index')}
                    className="inline-flex items-center rounded border border-transparent bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                    Back
                </Link>

                <form onSubmit={submit} className="mx-auto w-full max-w-md space-y-6">
                    <div className="space-y-3 rounded-md border border-gray-200 px-4 py-5 shadow-sm sm:p-6 dark:border-gray-700">
                        <label htmlFor="name" className="block text-center text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Name"
                            className="block w-full rounded-md border focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        {errors.name && <div className="text-center text-sm text-red-600">{errors.name}</div>}
                    </div>

                    <div className="space-y-3 rounded-md border border-gray-200 px-4 py-5 shadow-sm sm:p-6 dark:border-gray-700">
                        <label htmlFor="permissions" className="block text-center text-sm font-medium text-gray-700">
                            Permissions:
                        </label>

                        <ul className="list-inside list-disc">
                            {permissions.map((permission) => (
                                <li key={permission} className="flex items-center">
                                    <input
                                        id="permissions"
                                        type="checkbox"
                                        value={permission}
                                        onChange={(e) => handleCheckboxChange(permission, e.target.checked)}
                                        className="form-checkbox mr-2 rounded"
                                    />
                                    <span>{permission}</span>
                                </li>
                            ))}
                        </ul>

                        {errors.permissions && <div className="text-center text-sm text-red-600">{errors.permissions}</div>}
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
