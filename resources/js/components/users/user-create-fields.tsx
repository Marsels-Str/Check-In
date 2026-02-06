import { useT } from '@/lib/t';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

export default function UserCreateFields() {
    const t = useT();
    
    return (
        <div>
            <Form method="post" action={route('users.store')} className="rounded-lg px-4 py-2">
                {({ errors }) => (
                    <>
                        <div className="space-y-2">
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

                        <div className="p-2 text-center">
                            <Button variant="default">
                                {t('users.create.create')}
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </div>
    );
}
