import { useT } from '@/lib/t';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Form, Head, router } from '@inertiajs/react';

export default function CompleteBusiness() {
    function cancelSetup() {
        router.post(route('business.cancel'));
    }

    const t = useT();

    return (
        <>
            <Head title={t('auth.complete.business.title')} />
            <meta name="description" content="Complete your business profile to start using the application" />

            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="rounded-xl border bg-background p-2 shadow-xl">
                        <h1 className="text-xl font-bold dark:text-white">{t('auth.complete.business.label')}</h1>
                        <p className="text-muted-foreground">{t('auth.complete.business.text')}</p>

                        <Form method="post" action={route('business.store')} className="space-y-4">
                            {({ errors }) => (
                                <>
                                    <div>
                                        <Label htmlFor="name">{t('auth.complete.business.name')}</Label>
                                        <Input id="name" name="name" type="text" placeholder="1-50" />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div>
                                        <Label htmlFor="industry">{t('auth.complete.business.industry')}</Label>
                                        <Input id="industry" name="industry" type="text" placeholder="2-50" />
                                        <InputError message={errors.industry} />
                                    </div>

                                    <div>
                                        <Label htmlFor="email">{t('auth.complete.business.email')}</Label>
                                        <Input id="email" name="email" type="text" placeholder="100" />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div>
                                        <Label htmlFor="phone">{t('auth.complete.business.phone')}</Label>
                                        <Input id="phone" name="phone" type="number" placeholder="+123 45 678 90" />
                                        <InputError message={errors.phone} />
                                    </div>

                                    <div>
                                        <Label htmlFor="country">{t('auth.complete.business.country')}</Label>
                                        <Input id="country" name="country" type="text" placeholder="4-60" />
                                        <InputError message={errors.country} />
                                    </div>

                                    <div>
                                        <Label htmlFor="city">{t('auth.complete.business.city')}</Label>
                                        <Input id="city" name="city" type="text" placeholder="1-170" />
                                        <InputError message={errors.city} />
                                    </div>

                                    <div>
                                        <Label htmlFor="address">{t('auth.complete.business.address')}</Label>
                                        <Input id="address" name="address" type="text" placeholder="100" />
                                        <InputError message={errors.address} />
                                    </div>

                                    <div>
                                        <Label htmlFor="description">{t('auth.complete.business.description')}</Label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={3}
                                            placeholder="1000"
                                            className="block w-full rounded-lg border bg-background px-4 py-2"
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    <div>
                                        <Label htmlFor="logo">{t('auth.complete.business.logo')}</Label>
                                        <Input id="logo" name="logo" type="file" accept="image/*" />
                                        <InputError message={errors.logo} />
                                    </div>

                                    <div className="flex justify-center gap-2">
                                        <Button variant="default">{t('auth.complete.business.save')}</Button>

                                        <Button type="button" variant="outline" onClick={cancelSetup}>
                                            {t('auth.complete.business.cancel')}
                                        </Button>
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
