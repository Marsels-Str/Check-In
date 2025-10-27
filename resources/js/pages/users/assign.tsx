import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Head, Link, useForm } from '@inertiajs/react';
import { type BreadcrumbItem, type User } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Users', href: '/users' },
    { title: 'Assign Role', href: '/users' },
];

export default function Assign({ user, roles = [] as any[], userRoles = [] as number[] }: { user: User; roles: any[]; userRoles: number[] }) {
    const { data, setData, post, processing, errors } = useForm({
        role_ids: userRoles,
    });

    function submit(e: React.SyntheticEvent) {
        e.preventDefault();
        post(route('users.roles.assign', user.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assign Role" />
            <div className="px-4">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Assign a Role</h1>
                        <p className="text-sm text-gray-500">Assigning a role will allow the user to perform certain actions.</p>
                    </div>
                    <Link
                        href={route('users.index')}
                        className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                    >
                        Back
                    </Link>
                </div>

                <form
                    onSubmit={submit}
                    className="mx-auto w-full max-w-md space-y-6 rounded-lg px-6 py-6 shadow ring-1 ring-white/10 backdrop-blur-sm"
                >
                    <div className="space-y-4">
                        <h2 className="text-center text-lg font-medium">Select a Role for {user.name}</h2>

                        <div className="space-y-3">
                            {roles.map((role) => (
                                <label
                                    key={role.id}
                                    htmlFor={`role-${role.id}`}
                                    className="flex cursor-pointer items-center justify-between rounded-md border border-white/10 px-3 py-2 transition hover:bg-yellow-500/30"
                                >
                                    <span className="text-sm font-medium">{role.name}</span>
                                    <input
                                        type="radio"
                                        id={`role-${role.id}`}
                                        value={role.id}
                                        checked={data.role_ids.includes(role.id)}
                                        onChange={() => setData('role_ids', [role.id])}
                                        className="h-4 w-4 accent-pink-500"
                                    />
                                </label>
                            ))}
                        </div>

                        {errors.role_ids && <p className="text-center text-sm text-red-400">{errors.role_ids}</p>}
                    </div>

                    <div className="pt-4 text-center">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                        >
                            {processing ? 'Assigning...' : 'Assign'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
