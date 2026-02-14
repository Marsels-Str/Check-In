import { useT } from '@/lib/t';
import { useRef } from 'react';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import HeadingSmall from '@/components/heading-small';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    const t = useT();

    return (
        <div>
            <HeadingSmall title={t('settings.profile.delete.title')} description={t('settings.profile.delete.description')} />
            <div className="rounded-xl border bg-red-50/70 p-2 dark:bg-red-950/40">
                <div className="dark:text-white">
                    <p className="font-bold">{t('settings.profile.delete.warning')}</p>
                    <p>{t('settings.profile.delete.text')}</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive">{t('settings.profile.delete.dialog.delete')}</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>{t('settings.profile.delete.dialog.title')}</DialogTitle>
                        <DialogDescription>{t('settings.profile.delete.dialog.description')}</DialogDescription>

                        <Form
                            method="delete"
                            action={route('profile.destroy')}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-4"
                        >
                            {({ resetAndClearErrors, errors }) => (
                                <>
                                    <Label htmlFor="password" className="sr-only">
                                        {t('settings.profile.delete.dialog.password')}
                                    </Label>

                                    <Input id="password" type="password" name="password" ref={passwordInput} />

                                    <InputError message={errors.password} />

                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline" onClick={() => resetAndClearErrors()}>
                                                {t('settings.profile.delete.dialog.cancel')}
                                            </Button>
                                        </DialogClose>

                                        <Button variant="destructive">{t('settings.profile.delete.dialog.delete.confirm')}</Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
