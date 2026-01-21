import { useT } from '@/lib/t';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

export default function UserCreateFields() {
    const t = useT();
    
    return (
        <div className="mx-auto w-full max-w-md">
            <Form method="post" action={route('users.store')} className="space-y-6 rounded-lg px-6 py-6">
                {({ errors }) => (
                    <>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">{t('users.create.name')}</Label>
                                <Input id="name" name="name" />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <Label htmlFor="email">{t('users.create.email')}</Label>
                                <Input id="email" type="email" name="email" />
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <Label htmlFor="password">{t('users.create.password')}</Label>
                                <Input id="password" type="password" name="password" />
                                <InputError message={errors.password} />
                            </div>
                        </div>

                        <div className="pt-4 text-center">
                            <Button
                                type="submit"
                                className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                            >
                                {t('users.create.create')}
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </div>
    );
}
