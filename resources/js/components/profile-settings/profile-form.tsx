import { useT } from '@/lib/t';
import { User } from '@/types';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

interface Props {
    user: User;
}

export default function ProfileForm({ user }: Props) {
    const t = useT();
    
    return (
        <Form method="patch" action={route('profile.update')} options={{ preserveScroll: true }}>
            {({ errors }) => (
                <>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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
                            <Input id="phone" name="phone" defaultValue={user.profile?.phone} placeholder="+123 45 678 90" />
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

                    <div className="flex items-center mt-4">
                        <Button variant="default" className="w-full">
                            {t('settings.profile.save')}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
