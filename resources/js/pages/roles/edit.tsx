import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Roles', href: '/roles' },
    { title: 'Edit Role', href: '/roles' },
];

export default function Edit({ role, rolePermissions, permissions }: { role: any; rolePermissions: string[]; permissions: string[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Role: ${role.name}`} />

            <div className="px-4">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Edit Role</h1>
                        <p className="text-sm text-gray-500">Modify the role name and adjust its assigned permissions.</p>
                    </div>

                    <Link
                        href={route('roles.index')}
                        className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                    >
                        Back
                    </Link>
                </div>

                <Form
                    method="patch"
                    action={route('roles.update', role.id)}
                    className="mx-auto w-full max-w-md space-y-6 rounded-lg border border-gray-200 bg-white px-6 py-6 shadow-sm dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm"
                >
                    {({ errors }) => (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="name">Role Name</Label>
                                <Input id="name" name="name" defaultValue={role.name} placeholder="Enter role name" />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-3">
                                <Label>Permissions</Label>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    {permissions.map((permission, id) => (
                                        <Label
                                            key={id}
                                            className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 transition hover:bg-yellow-50 dark:border-white/10 dark:bg-black/20 dark:text-gray-300 dark:hover:bg-white/10"
                                        >
                                            <Input
                                                type="checkbox"
                                                name="permissions[]"
                                                value={permission}
                                                defaultChecked={rolePermissions.includes(permission)}
                                                className="h-4 w-4 accent-yellow-500 dark:accent-yellow-400"
                                            />
                                            <span>{permission}</span>
                                        </Label>
                                    ))}
                                </div>
                                <InputError message={errors.permissions} />
                            </div>

                            <div className="pt-4 text-center">
                                <Button
                                    type="submit"
                                    className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                                >
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
