import { useT } from '@/lib/t';
import { User } from '@/types';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

export default function UserEditFields({ user }: { user: User }) {
    const t = useT();
    
    return (
        <div className="mx-auto max-w-md border rounded-lg">
            <h2 className="text-lg text-center font-bold">{t('users.edit.info')}</h2>

            <Form
                method="put"
                action={route('users.update', user.id)}
                className="rounded-lg px-4 py-2 shadow-xl"
            >
                {({ errors }) => (
                    <>
                        <div className="space-y-2">
                            <div>
                                <Label htmlFor="name">{t('users.edit.name')}</Label>
                                <Input id="name" type="name" name="name" defaultValue={user.name} />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <Label htmlFor="email">{t('users.edit.email')}</Label>
                                <Input id="email" type="email" name="email" defaultValue={user.email} />
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <Label htmlFor="password">{t('users.edit.password')}</Label>
                                <Input id="password" type="password" name="password" />
                                <InputError message={errors.password} />
                            </div>
                        </div>

                        <div className="p-2 text-center">
                            <Button variant="default">
                                {t('users.edit.save')}
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </div>
    );
}
