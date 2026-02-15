import { useT } from '@/lib/t';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

export default function CompleteProfile() {
    const t = useT();

    return (
        <>
            <Head title={t('auth.complete.profile.title')} />
            <meta name="description" content="Complete your profile to start using the application" />

            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="w-full max-w-lg">
                    <div className="rounded-xl border bg-background p-2 shadow-xl">
                        <h1 className="text-xl font-bold dark:text-white">{t('auth.complete.profile.label')}</h1>
                        <p className="mb-4 text-muted-foreground">{t('auth.complete.profile.text')}</p>

                        <Form method="post" action={route('profile.complete.store')} className="space-y-4">
                            {({ errors }) => (
                                <>
                                    <div>
                                        <Label htmlFor="age">{t('auth.complete.profile.age')}</Label>
                                        <Input id="age" name="age" type="number" placeholder="14-100" />
                                        <InputError message={errors.age} />
                                    </div>

                                    <div>
                                        <Label htmlFor="height">{t('auth.complete.profile.height')}</Label>
                                        <Input id="height" name="height" type="number" placeholder="100-300" />
                                        <InputError message={errors.height} />
                                    </div>

                                    <div>
                                        <Label htmlFor="weight">{t('auth.complete.profile.weight')}</Label>
                                        <Input id="weight" name="weight" type="number" placeholder="40-700" />
                                        <InputError message={errors.weight} />
                                    </div>

                                    <div>
                                        <Label htmlFor="phone">{t('auth.complete.profile.phone')}</Label>
                                        <Input id="phone" name="phone" type="number" placeholder="+123 45 678 90" />
                                        <InputError message={errors.phone} />
                                    </div>

                                    <div>
                                        <Label htmlFor="personal_code">{t('auth.complete.profile.code')}</Label>
                                        <Input id="personal_code" name="personal_code" type="text" placeholder="000000-00000" />
                                        <InputError message={errors.personal_code} />
                                    </div>

                                    <div>
                                        <Label htmlFor="country">{t('auth.complete.profile.country')}</Label>
                                        <Input id="country" name="country" type="text" placeholder="4-60 characters" />
                                        <InputError message={errors.country} />
                                    </div>

                                    <div>
                                        <Label htmlFor="city">{t('auth.complete.profile.city')}</Label>
                                        <Input id="city" name="city" type="text" placeholder="1-170 characters" />
                                        <InputError message={errors.city} />
                                    </div>

                                    <div>
                                        <Label htmlFor="portrait">{t('auth.complete.profile.portrait')}</Label>
                                        <Input id="portrait" name="portrait" type="file" accept="image/*" />
                                        <InputError message={errors.portrait} />
                                    </div>

                                    <div className="pt-2 text-center">
                                        <Button variant="default">{t('auth.complete.profile.save')}</Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}
