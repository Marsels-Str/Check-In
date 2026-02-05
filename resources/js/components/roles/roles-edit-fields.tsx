import { useT } from '@/lib/t';
import { Role } from '@/types';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

interface Props {
    role: Role;
    rolePermissions: string[];
    permissions: string[];
}

export default function RolesEditFields({ role, rolePermissions, permissions }: Props) {
    const t = useT();
    
    return (
        <Form
            method="put"
            action={route('roles.update', role.id)}
            className="mx-auto max-w-2xl space-y-2 rounded-lg border bg-background px-6 py-6 shadow-xl"
        >
            {({ errors }) => (
                <>
                    <div>
                        <Label htmlFor="name">{t('roles.edit.name')}</Label>
                        <Input id="name" name="name" defaultValue={role.name} />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Label>{t('roles.edit.permissions')}</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {permissions.map((permission, id) => (
                                <Label
                                    key={id}
                                    className="flex cursor-pointer items-center gap-2 rounded-md border bg-background px-3 py-2 hover:bg-muted dark:text-white"
                                >
                                    <Input
                                        type="checkbox"
                                        name="permissions[]"
                                        value={permission}
                                        defaultChecked={rolePermissions.includes(permission)}
                                        className="h-4 w-4 accent-emerald-300 dark:accent-emerald-500"
                                    />
                                    <span>{permission}</span>
                                </Label>
                            ))}
                        </div>
                        <InputError message={errors.permissions} />
                    </div>

                    <div className="text-center">
                        <Button variant="default">
                            {t('roles.edit.save')}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
