import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Users', href: '/users' },
    { title: 'Assign Role', href: '/users' },
];

export default function Assign({
    user,
    roles = [] as { id: number; name: string }[],
    userRoles = [] as number[],
}: {
    user: User;
    roles: { id: number; name: string }[];
    userRoles: number[];
}) {
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

                <Form
                    method="post"
                    action={route('users.roles.assign', user.id)}
                    className="mx-auto w-full max-w-md space-y-6 rounded-lg px-6 py-6 shadow ring-1 ring-white/10 backdrop-blur-sm"
                >
                    {({ errors }) => (
                        <>
                            <div className="space-y-4">
                                <h2 className="text-center text-lg font-medium">Select a Role for {user.name}</h2>

                                <div className="space-y-3">
                                    {roles.map((role) => (
                                        <div key={role.id}>
                                            <Label
                                                htmlFor={`role-${role.id}`}
                                                className="flex cursor-pointer items-center justify-between rounded-md border border-white/10 px-3 py-2 transition hover:bg-yellow-500/30"
                                            >
                                                <span className="text-sm font-medium">{role.name}</span>
                                                <Input
                                                    type="radio"
                                                    name="role_ids[]"
                                                    id={`role-${role.id}`}
                                                    value={role.id}
                                                    defaultChecked={userRoles.includes(role.id)}
                                                    className="h-4 w-4 accent-pink-500"
                                                />
                                            </Label>
                                        </div>
                                    ))}
                                </div>

                                <InputError message={errors.role_ids} />
                            </div>

                            <div className="pt-4 text-center">
                                <Button
                                    type="submit"
                                    className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                                >
                                    Assign
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
