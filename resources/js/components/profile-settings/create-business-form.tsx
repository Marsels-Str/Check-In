import { useT } from '@/lib/t';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

export default function CreateBusinessForm() {
    const t = useT();

    return (
        <>
            <Form method="post" action={route('business.store')} options={{ preserveScroll: true }}>
                {({ errors }) => (
                    <>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <div>
                                <Label htmlFor="name">{t('settings.business.name')}</Label>
                                <Input id="name" name="name" />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <Label htmlFor="industry">{t('settings.business.industry')}</Label>
                                <Input id="industry" name="industry" />
                                <InputError message={errors.industry} />
                            </div>

                            <div>
                                <Label htmlFor="email">{t('settings.business.email')}</Label>
                                <Input id="email" type="email" name="email" />
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <Label htmlFor="phone">{t('settings.business.phone')}</Label>
                                <Input id="phone" name="phone" placeholder="+123 45 678 90" />
                                <InputError message={errors.phone} />
                            </div>

                            <div>
                                <Label htmlFor="address">{t('settings.business.adress')}</Label>
                                <Input id="address" name="address" />
                                <InputError message={errors.address} />
                            </div>

                            <div>
                                <Label htmlFor="description">{t('settings.business.description')}</Label>
                                <Input id="description" name="description" />
                                <InputError message={errors.description} />
                            </div>

                            <div>
                                <Label htmlFor="country">{t('settings.business.country')}</Label>
                                <Input id="country" name="country" />
                                <InputError message={errors.country} />
                            </div>

                            <div>
                                <Label htmlFor="city">{t('settings.business.city')}</Label>
                                <Input id="city" name="city" />
                                <InputError message={errors.city} />
                            </div>
                        </div>

                        <div className="mt-4 flex items-center">
                            <Button variant="default" className="w-full">
                                {t('settings.business.create')}
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}
