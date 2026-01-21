import { useT } from '@/lib/t';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

export default function ProfileForm({ user }: { user: any; }) {
    const t = useT();
    
    return (
        <Form method="patch" action={route('profile.update')} options={{ preserveScroll: true }} className="space-y-6">
            {({ errors }) => (
                <>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <Label htmlFor="name">{t('settings.profile.name')}</Label>
                            <Input id="name" name="name" defaultValue={user.name} />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <Label htmlFor="email">{t('settings.profile.email')}</Label>
                            <Input id="email" type="email" name="email" defaultValue={user.email} />
                            <InputError message={errors.email} />
                        </div>

                        <div>
                            <Label htmlFor="age">{t('settings.profile.age')}</Label>
                            <Input id="age" name="age" defaultValue={user.profile?.age} />
                            <InputError message={errors.age} />
                        </div>

                        <div>
                            <Label htmlFor="height">{t('settings.profile.height')}</Label>
                            <Input id="height" name="height" defaultValue={user.profile?.height} />
                            <InputError message={errors.height} />
                        </div>

                        <div>
                            <Label htmlFor="weight">{t('settings.profile.weight')}</Label>
                            <Input id="weight" name="weight" defaultValue={user.profile?.weight} />
                            <InputError message={errors.weight} />
                        </div>

                        <div>
                            <Label htmlFor="phone">{t('settings.profile.phone')}</Label>
                            <Input id="phone" name="phone" defaultValue={user.profile?.phone} />
                            <InputError message={errors.phone} />
                        </div>

                        <div>
                            <Label htmlFor="personal_code">{t('settings.profile.code')}</Label>
                            <Input id="personal_code" name="personal_code" defaultValue={user.profile?.personal_code} placeholder="000000-00000" />
                            <InputError message={errors.personal_code} />
                        </div>

                        <div>
                            <Label htmlFor="country">{t('settings.profile.country')}</Label>
                            <Input id="country" name="country" defaultValue={user.profile?.country} />
                            <InputError message={errors.country} />
                        </div>

                        <div>
                            <Label htmlFor="city">{t('settings.profile.city')}</Label>
                            <Input id="city" name="city" defaultValue={user.profile?.city} />
                            <InputError message={errors.city} />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            className="inline-flex w-full items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                        >
                            {t('settings.profile.save')}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
