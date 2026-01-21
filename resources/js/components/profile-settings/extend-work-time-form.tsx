import { useT } from '@/lib/t';
import { useState } from 'react';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

export default function ExtendWorkTimeForm({ initialMinutes }: { initialMinutes: number }) {
    const [extendedMinutes, setExtendedMinutes] = useState(initialMinutes || '');
    
    const t = useT();

    return (
        <div className="mx-auto w-full max-w-lg">
            <Form
                method="post"
                action={route('auto-clock.extend')}
                className="space-y-5 rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm transition-all duration-300 dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm"
            >
                {({ errors }) => (
                    <>
                        <Label>{t('settings.clocking.extend.label')}</Label>
                        <p className="text-gray-500">{t('settings.clocking.extend.description')}</p>

                        <Input
                            type="number"
                            name="extended_minutes"
                            id="extended_minutes"
                            value={extendedMinutes}
                            onChange={(e) => setExtendedMinutes(e.target.value)}
                        />
                        <InputError message={errors.extended_minutes} />

                        <div className="pt-2 text-center">
                            <Button
                                type="submit"
                                className="rounded-lg bg-green-200/20 px-4 py-2 text-sm font-medium text-green-700 ring-1 ring-green-400/30 transition-all duration-300 ring-inset hover:bg-green-200/40 hover:text-green-800 hover:ring-green-400/40 dark:bg-green-900/30 dark:text-green-300 dark:ring-green-500/30 dark:hover:bg-green-800/40 dark:hover:text-green-200 dark:hover:ring-green-500/30"
                            >
                                {t('settings.clocking.extend.save')}
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </div>
    );
}
