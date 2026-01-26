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
        <form
            onSubmit={submit}
            className="mx-auto w-full max-w-md space-y-6 rounded-lg border border-gray-200 bg-white px-6 py-6 shadow-sm dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm"
        >
            <div className="space-y-2">
                <Label htmlFor="name">{t('roles.create.name')}</Label>
                <Input type="text" id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                <InputError message={errors.name} />
            </div>

            {canAccess && (
                <div className="flex justify-center pt-1">
                    <BusinessDropdownMenu
                        businesses={businesses}
                        selectedBusinessId={data.business_id}
                        onChange={(id) => setData('business_id', id)}
                    />
                </div>
            )}

            <div className="space-y-3">
                <Label>{t('roles.create.permissions')}</Label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {permissions.map((permission, id) => (
                        <Label
                            key={id}
                            className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 transition hover:bg-yellow-50 dark:border-white/10 dark:bg-black/20 dark:text-gray-300 dark:hover:bg-white/10"
                        >
                            <Input
                                type="checkbox"
                                value={permission}
                                checked={data.permissions.includes(permission)}
                                onChange={(e) => handleCheckboxChange(permission, e.target.checked)}
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
                    className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 disabled:opacity-50 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                >
                    {t('roles.create.save')}
                </Button>
            </div>
        </form>
    );
}
