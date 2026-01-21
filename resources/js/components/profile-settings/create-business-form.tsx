import { useT } from '@/lib/t';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

export default function CreateBusinessForm() {
    const t = useT();
    
    return (
        <div className="rounded-2xl p-6">
            <Form method="post" action={route('business.store')} options={{ preserveScroll: true }} className="mt-6 space-y-6">
                {({ errors }) => (
                    <>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

                            <div className="md:col-span-2">
                                <Label htmlFor="address">{t('settings.business.adress')}</Label>
                                <Input id="address" name="address" />
                                <InputError message={errors.address} />
                            </div>

                            <div className="md:col-span-2">
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

                        <div className="flex items-center gap-4">
                            <Button
                                className="inline-flex w-full items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                            >
                                {t('settings.business.create')}
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </div>
    );
}
