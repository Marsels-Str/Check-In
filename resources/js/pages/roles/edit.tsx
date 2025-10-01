import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Edit Role',
        href: '/roles',
    },
];

export default function Edit({ role, rolePermissions, permissions }: { role: any; rolePermissions: string[]; permissions: string[] }) {
    const { data, setData, put, errors } = useForm({
        name: role.name || '',
        permissions: rolePermissions || [],
    } as { name: string; permissions: string[] });

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
        put(route('roles.update', role.id));
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

                <form onSubmit={submit} className="mx-auto max-w-md space-y-4 text-center">
                    <div className="rounded-lg border border-gray-400 px-6 py-4">
                        <label htmlFor="name" className="text-gray-400">
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Name"
                            className="w-full rounded-lg border border-gray-400"
                        />
                        {errors.name && <div className="text-red-500">{errors.name}</div>}
                    </div>

                    <div className="rounded-lg border border-gray-400 px-6 py-4">
                        <label htmlFor="permissions" className="text-gray-400">
                            Permissions:
                        </label>

                        <ul>
                            {permissions.map((permission) => (
                                <label key={permission} className="flex">
                                    <input
                                        id="permissions"
                                        type="checkbox"
                                        value={permission}
                                        checked={data.permissions.includes(permission)}
                                        onChange={(e) => handleCheckboxChange(permission, e.target.checked)}
                                    />
                                    <span className="ml-2">{permission}</span>
                                </label>
                            ))}
                        </ul>
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
