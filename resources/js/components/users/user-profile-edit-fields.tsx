import { useT } from '@/lib/t';
import { UserProfile } from '@/types';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

interface Props {
    profile: UserProfile;
}

export default function UserProfileFields({ profile }: Props) {
    const t = useT();

    return (
        <div className="mx-auto w-full max-w-md">
            <Form
                method="patch"
                action={route('users.update-user-profile', profile.user_id)}
                className="space-y-6 rounded-xl border px-6 py-6 shadow-md backdrop-blur-sm"
            >
                {({ errors }) => (
                    <>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="age">{t('users.profile.age')}</Label>
                                <Input id="age" type="number" name="age" defaultValue={profile.age} placeholder="14-100" />
                                <InputError message={errors.age} />
                            </div>

                            <div>
                                <Label htmlFor="height">{t('users.profile.height')}</Label>
                                <Input id="height" type="number" name="height" defaultValue={profile.height} placeholder="100-300" />
                                <InputError message={errors.height} />
                            </div>

                            <div>
                                <Label htmlFor="weight">{t('users.profile.weight')}</Label>
                                <Input id="weight" type="number" name="weight" defaultValue={profile.weight} placeholder="40-700" />
                                <InputError message={errors.weight} />
                            </div>

                            <div>
                                <Label htmlFor="phone">{t('users.profile.phone')}</Label>
                                <Input id="phone" type="text" name="phone" defaultValue={profile.phone} placeholder="8-15" />
                                <InputError message={errors.phone} />
                            </div>

                            <div>
                                <Label htmlFor="personal_code">{t('users.profile.code')}</Label>
                                <Input
                                    id="personal_code"
                                    type="text"
                                    name="personal_code"
                                    defaultValue={profile.personal_code}
                                    placeholder="000000-00000"
                                />
                                <InputError message={errors.personal_code} />
                            </div>

                            <div>
                                <Label htmlFor="country">{t('users.profile.country')}</Label>
                                <Input id="country" type="text" name="country" defaultValue={profile.country} placeholder="4-60" />
                                <InputError message={errors.country} />
                            </div>

                            <div>
                                <Label htmlFor="city">{t('users.profile.city')}</Label>
                                <Input id="city" type="text" name="city" defaultValue={profile.city} placeholder="1-170" />
                                <InputError message={errors.city} />
                            </div>
                        </div>

                        <div className="pt-4 text-center">
                            <Button
                                type="submit"
                                className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                            >
                                {t('users.profile.save')}
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </div>
    );
}
