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
        <div className="space-y-6">
            <HeadingSmall title={t('settings.profile.delete.title')} description= {t('settings.profile.delete.description')} />
            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">{t('settings.profile.delete.warning')}</p>
                    <p className="text-sm">{t('settings.profile.delete.text')}</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive">{t('settings.profile.delete.dialog.delete')}</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>{t('settings.profile.delete.dialog.title')}</DialogTitle>
                        <DialogDescription>
                            {t('settings.profile.delete.dialog.description')}
                        </DialogDescription>

                        <Form
                            method="delete"
                            action={route('profile.destroy')}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password" className="sr-only">
                                            {t('settings.profile.delete.dialog.password')}
                                        </Label>

                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            ref={passwordInput}
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button variant="secondary" onClick={() => resetAndClearErrors()}>
                                                {t('settings.profile.delete.dialog.cancel')}
                                            </Button>
                                        </DialogClose>

                                        <Button variant="destructive" asChild>
                                            <button type="submit">{t('settings.profile.delete.dialog.delete.confirm')}</button>
                                        </Button>
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
