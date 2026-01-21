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

            <div className="mx-auto w-full max-w-lg px-4 py-10">
                <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm transition-all duration-300 dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm">
                    <h1 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('auth.complete.business.label')}</h1>
                    <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">{t('auth.complete.business.text')}</p>

                    <Form method="post" action={route('business.store')} className="space-y-5">
                        {({ errors }) => (
                            <>
                                <div>
                                    <Label htmlFor="name">{t('auth.complete.business.name')}</Label>
                                    <Input id="name" name="name" type="text" placeholder='1-50' />
                                    <InputError message={errors.name} />
                                </div>

                                <div>
                                    <Label htmlFor="industry">{t('auth.complete.business.industry')}</Label>
                                    <Input id="industry" name="industry" type="text" placeholder='2-50' />
                                    <InputError message={errors.industry} />
                                </div>

                                <div>
                                    <Label htmlFor="email">{t('auth.complete.business.email')}</Label>
                                    <Input id="email" name="email" type="text" placeholder='100' />
                                    <InputError message={errors.email} />
                                </div>

                                <div>
                                    <Label htmlFor="phone">{t('auth.complete.business.phone')}</Label>
                                    <Input id="phone" name="phone" type="number" placeholder="8-15" />
                                    <InputError message={errors.phone} />
                                </div>

                                <div>
                                    <Label htmlFor="country">{t('auth.complete.business.country')}</Label>
                                    <Input id="country" name="country" type="text" placeholder='4-60' />
                                    <InputError message={errors.country} />
                                </div>

                                <div>
                                    <Label htmlFor="city">{t('auth.complete.business.city')}</Label>
                                    <Input id="city" name="city" type="text" placeholder='1-170' />
                                    <InputError message={errors.city} />
                                </div>

                                <div>
                                    <Label htmlFor="address">{t('auth.complete.business.address')}</Label>
                                    <Input id="address" name="address" type="text" placeholder='100' />
                                    <InputError message={errors.address} />
                                </div>

                                <div>
                                    <Label htmlFor="description">{t('auth.complete.business.description')}</Label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        placeholder='1000'
                                        className="block w-full rounded-md border border-gray-300 bg-white/80 px-3 py-2 text-sm text-gray-900 shadow-sm transition-all placeholder:text-gray-400 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-white/10 dark:bg-[#0f0f0f]/70 dark:text-gray-100 dark:placeholder:text-gray-500"
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div>
                                    <Label htmlFor="logo">{t('auth.complete.business.logo')}</Label>
                                    <Input id="logo" name="logo" type="file" accept="image/*" />
                                    <InputError message={errors.logo} />
                                </div>

                                <div className="flex justify-center gap-3 pt-4">
                                    <Button
                                        type="submit"
                                        className="rounded-lg bg-pink-200/20 px-4 py-2 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                                    >
                                        {t('auth.complete.business.save')}
                                    </Button>

                                    <Button
                                        type="button"
                                        onClick={cancelSetup}
                                        className="rounded-lg bg-gray-200/60 px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-300/50 transition-all duration-300 hover:bg-gray-300/60 hover:text-gray-900 dark:bg-gray-800/60 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700/60 dark:hover:text-white"
                                    >
                                        {t('auth.complete.business.cancel')}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </>
    );
}
