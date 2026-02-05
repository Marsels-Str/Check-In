import { useT } from '@/lib/t';
import { useCan } from '@/lib/can';
import { BusinessProfile } from '@/types';
import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import BusinessDropdownMenu from '@/components/business-dropdown-menu';

interface Props {
    permissions: string[];
    businesses: BusinessProfile[];
    auth: any;
}

interface RoleData {
    name: string;
    permissions: string[];
    business_id: number | null;
}

export default function RolesCreateFields({ permissions, businesses, auth }: Props) {
    const canAccess = useCan('business.access');

    const { data, setData, post, errors } = useForm<RoleData>({
        name: '',
        permissions: [],
        business_id: canAccess ? (auth.user.ownedBusiness?.id ?? null) : null,
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

    const t = useT();

    return (
        <form onSubmit={submit} className="mx-auto max-w-2xl space-y-2 rounded-lg border bg-background px-6 py-6 shadow-xl">
            <div>
                <Label htmlFor="name">{t('roles.create.name')}</Label>
                <Input type="text" id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                <InputError message={errors.name} />
            </div>

            {canAccess && (
                <div className="flex justify-center">
                    <BusinessDropdownMenu
                        businesses={businesses}
                        selectedBusinessId={data.business_id}
                        onChange={(id) => setData('business_id', id)}
                    />
                </div>
            )}

            <div>
                <Label>{t('roles.create.permissions')}</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {permissions.map((permission, id) => (
                        <Label
                            key={id}
                            className="flex cursor-pointer items-center gap-2 rounded-md border bg-background px-3 py-2 hover:bg-muted dark:text-white"
                        >
                            <Input
                                type="checkbox"
                                value={permission}
                                checked={data.permissions.includes(permission)}
                                onChange={(e) => handleCheckboxChange(permission, e.target.checked)}
                                className="h-4 w-4 accent-yellow-200 dark:accent-yellow-400"
                            />
                            <span>{permission}</span>
                        </Label>
                    ))}
                </div>
                <InputError message={errors.permissions} />
            </div>

            <div className="text-center">
                <Button variant="default">{t('roles.create.save')}</Button>
            </div>
        </form>
    );
}
