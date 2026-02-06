import { useT } from '@/lib/t';
import { useState } from 'react';
import { Role, User } from '@/types';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

interface Props {
    user: User;
    globalRoles: Role[];
    businessRoles: Role[];
    userRole: number[];
}

export default function RoleAssignFields({ user, globalRoles, businessRoles, userRole}: Props) {
    const t = useT();

    const [currentRole, setCurrentRole] = useState<number | null>(
        userRole.length > 0 ? userRole[0] : null
    );

    return (
        <Form method="post" action={route('users.roles.assign', user.id)}>
            {({ errors }) => (
                <>
                    <div className="space-y-4">
                        <div className="mx-auto max-w-md space-y-2 rounded-lg px-4 py-2 shadow-md border">
                            <h3 className="text-sm font-bold text-muted-foreground">{t('users.roles.global')}</h3>

                            {globalRoles.map((role) => (
                                <Label
                                    key={role.id}
                                    htmlFor={`role-${role.id}`}
                                    className="flex cursor-pointer justify-between rounded-lg border px-2 py-2 hover:bg-muted"
                                >
                                    <span className="text-sm font-medium">{role.name}</span>
                                    <Input
                                        type="radio"
                                        name="role_ids[]"
                                        id={`role-${role.id}`}
                                        value={role.id}
                                        checked={currentRole === role.id}
                                        onChange={() => setCurrentRole(role.id)}
                                        className="h-4 w-4 accent-emerald-600 dark:accent-emerald-500"
                                    />
                                </Label>
                            ))}
                        </div>

                        <div className="mx-auto max-w-md space-y-2 rounded-lg px-4 py-2 shadow-md border">
                            <h3 className="text-sm font-bold text-muted-foreground">{t('users.roles.business')}</h3>

                            {businessRoles.map((role) => (
                                <Label
                                    key={role.id}
                                    htmlFor={`role-${role.id}`}
                                    className="flex cursor-pointer justify-between rounded-md border px-2 py-2 hover:bg-muted"
                                >
                                    <span className="text-sm font-medium">{role.name}</span>
                                    <Input
                                        type="radio"
                                        name="role_ids[]"
                                        id={`role-${role.id}`}
                                        value={role.id}
                                        checked={currentRole === role.id}
                                        onChange={() => setCurrentRole(role.id)}
                                        className="h-4 w-4 accent-emerald-600 dark:accent-emerald-500"
                                    />
                                </Label>
                            ))}
                        </div>

                        <InputError message={errors.role_ids} />
                    </div>

                    <div className="p-2 text-center">
                        <Button variant="default">{t('users.roles.assign')}</Button>
                    </div>
                </>
            )}
        </Form>
    );
}
