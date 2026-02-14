import { useT } from '@/lib/t';
import { Form } from '@inertiajs/react';
import { BusinessProfile } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

interface Props {
    business: BusinessProfile;
}

export default function BusinessForm({ business }: Props) {
    const t = useT();

    return (
        <Form method="post" action={route('business.update')} options={{ preserveScroll: true }}>
            {({ errors }) => (
                <>
                    <input type="hidden" name="business_id" value={business?.id} />

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <div>
                            <Label htmlFor="name">{t('settings.business.name')}</Label>
                            <Input id="name" name="name" defaultValue={business?.name} />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <Label htmlFor="industry">{t('settings.business.industry')}</Label>
                            <Input id="industry" name="industry" defaultValue={business?.industry} />
                            <InputError message={errors.industry} />
                        </div>

                        <div>
                            <Label htmlFor="email">{t('settings.business.email')}</Label>
                            <Input id="email" type="email" name="email" defaultValue={business?.email} />
                            <InputError message={errors.email} />
                        </div>

                        <div>
                            <Label htmlFor="phone">{t('settings.business.phone')}</Label>
                            <Input id="phone" name="phone" defaultValue={business?.phone} placeholder="+123 45 678 90" />
                            <InputError message={errors.phone} />
                        </div>

                        <div>
                            <Label htmlFor="address">{t('settings.business.adress')}</Label>
                            <Input id="address" name="address" defaultValue={business?.address} />
                            <InputError message={errors.address} />
                        </div>

                        <div>
                            <Label htmlFor="description">{t('settings.business.description')}</Label>
                            <Input id="description" name="description" defaultValue={business?.description} />
                            <InputError message={errors.description} />
                        </div>

                        <div>
                            <Label htmlFor="country">{t('settings.business.country')}</Label>
                            <Input id="country" name="country" defaultValue={business?.country} />
                            <InputError message={errors.country} />
                        </div>

                        <div>
                            <Label htmlFor="city">{t('settings.business.city')}</Label>
                            <Input id="city" name="city" defaultValue={business?.city} />
                            <InputError message={errors.city} />
                        </div>
                    </div>

                    <div className="flex items-center mt-4">
                        <Button variant="default" className="w-full">{t('settings.business.save')}</Button>
                    </div>
                </>
            )}
        </Form>
    );
}
