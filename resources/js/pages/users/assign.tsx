
import { type BreadcrumbItem, type User } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
    {
      title: 'Assign Role',
      href: '/users',
    },
];

export default function Assign({
    user,
    roles = [] as any[],
    userRoles = [] as number[],
}: {
    user: User,
    roles: any[],
    userRoles: number[],
}) {
    const { data, setData, post, errors } = useForm({
        role_ids: userRoles,
    });
    function toggleRole(id: number) {
        if (data.role_ids.includes(id)) {
            setData('role_ids', data.role_ids.filter(rid => rid !== id));
        } else {
            setData('role_ids', [...data.role_ids, id]);
        }
    }
    function submit(e: React.SyntheticEvent) {
        e.preventDefault();
        post(route('users.roles.assign', user.id));
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assign Role" />
            <div>
                <Link
                    href={route('users.index')}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Back
                </Link>
                <form onSubmit={submit} className="space-y-6 mx-auto w-full max-w-md">
                    <div className="space-y-3 border border-gray-400 px-4 py-5 sm:p-6 rounded-md shadow-sm">
                        <label className="block text-sm font-medium text-gray-400 text-center">
                            Select Roles
                        </label>
                        <div className="space-y-2">
                            {roles.map(role => (
                                <div key={role.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`role-${role.id}`}
                                        value={role.id}
                                        checked={data.role_ids.includes(role.id)}
                                        onChange={() => toggleRole(role.id)}
                                        className="h-4 w-4"
                                    />
                                    <label htmlFor={`role-${role.id}`} className="ml-2 text-sm text-gray-700">
                                        {role.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors.role_ids && (
                            <div className="text-sm text-red-600 text-center">{errors.role_ids}</div>
                        )}
                    </div>
                    <div className="text-center">
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Assign
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
