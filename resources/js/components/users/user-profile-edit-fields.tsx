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
        <div className="mx-auto max-w-md border rounded-xl">
            <h2 className="text-center text-lg font-bold">{t('users.edit.profile.info')}</h2>

            <Form
                method="patch"
                action={route('users.update-user-profile', profile.user_id)}
                className="rounded-xl px-4 py-2 shadow-xl"
            >
                {({ errors }) => (
                    <>
                        <div className="space-y-2">
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

                        <div className="p-2 text-center">
                            <Button variant="default">
                                {t('users.profile.save')}
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </div>
    );
}
