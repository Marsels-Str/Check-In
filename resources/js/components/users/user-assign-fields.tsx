import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';

export default function RoleAssignFields({
    userId,
    globalRoles = [],
    businessRoles = [],
    selectedRoles = [],
}: {
    userId: number;
    globalRoles: { id: number; name: string }[];
    businessRoles: { id: number; name: string }[];
    selectedRoles: number[];
}) {
    return (
        <Form method="post" action={route('users.roles.assign', userId)}>
            {({ errors }) => (
                <>
                    <div className="space-y-4">
                        <div className="mx-auto w-full max-w-md space-y-3 rounded-lg px-6 py-6 shadow ring-1 ring-white/10 backdrop-blur-sm">
                            <h3 className="mb-2 text-sm font-semibold text-gray-500">Global Roles</h3>

                            {globalRoles.map((role) => (
                                <Label
                                    key={role.id}
                                    htmlFor={`role-${role.id}`}
                                    className="flex cursor-pointer items-center justify-between rounded-md border border-white/10 px-3 py-2 transition hover:bg-yellow-500/30"
                                >
                                    <span className="text-sm font-medium">{role.name}</span>
                                    <Input
                                        type="radio"
                                        name="role_ids[]"
                                        id={`role-${role.id}`}
                                        value={role.id}
                                        defaultChecked={selectedRoles.includes(role.id)}
                                        className="h-4 w-4 accent-pink-500"
                                    />
                                </Label>
                            ))}
                        </div>

                        <div className="mx-auto w-full max-w-md space-y-3 rounded-lg px-6 py-6 shadow ring-1 ring-white/10 backdrop-blur-sm">
                            <h3 className="mb-2 text-sm font-semibold text-gray-500">Roles for this Business</h3>

                            {businessRoles.map((role) => (
                                <Label
                                    key={role.id}
                                    htmlFor={`role-${role.id}`}
                                    className="flex cursor-pointer items-center justify-between rounded-md border border-white/10 px-3 py-2 transition hover:bg-yellow-500/30"
                                >
                                    <span className="text-sm font-medium">{role.name}</span>
                                    <Input
                                        type="radio"
                                        name="role_ids[]"
                                        id={`role-${role.id}`}
                                        value={role.id}
                                        defaultChecked={selectedRoles.includes(role.id)}
                                        className="h-4 w-4 accent-pink-500"
                                    />
                                </Label>
                            ))}
                        </div>

                        <InputError message={errors.role_ids} />
                    </div>

                    <div className="pt-4 text-center">
                        <Button type="submit">Assign</Button>
                    </div>
                </>
            )}
        </Form>
    );
}
