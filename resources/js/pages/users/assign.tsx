import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
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

export default function Assign({ user, roles = [] as any[], userRoles = [] as number[] }: { user: User; roles: any[]; userRoles: number[] }) {
    const { data, setData, post, errors } = useForm({
        role_ids: userRoles,
    });
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
                    className="inline-flex items-center rounded border border-transparent bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                    Back
                </Link>
                <form onSubmit={submit} className="mx-auto w-full max-w-md space-y-6">
                    <div className="space-y-3 rounded-md border border-gray-400 px-4 py-5 shadow-sm sm:p-6">
                        <label className="block text-center text-sm font-medium text-gray-400">Select Roles</label>
                        <div className="space-y-2">
                            {roles.map((role) => (
                                <div key={role.id} className="flex items-center">
                                    <input
                                        type="radio"
                                        id={`role-${role.id}`}
                                        value={role.id}
                                        checked={data.role_ids.includes(role.id)}
                                        onChange={() => setData('role_ids', [role.id])}
                                        className="h-4 w-4"
                                    />
                                    <label htmlFor={`role-${role.id}`} className="ml-2 text-sm text-gray-700">
                                        {role.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors.role_ids && <div className="text-center text-sm text-red-600">{errors.role_ids}</div>}
                    </div>
                    <div className="text-center">
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                        >
                            Assign
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
