import { useT } from '@/lib/t';
import { useRef } from 'react';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

export default function AutoClockForm({ settings }: { settings: any }) {
    const lunchStartRef = useRef<HTMLInputElement>(null);
    const lunchEndRef = useRef<HTMLInputElement>(null);

    const t = useT();

    return (
        <div className="mx-auto w-full max-w-lg">
            <Form
                method="put"
                action={route('auto-clock.update')}
                className="space-y-5 rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm transition-all duration-300 dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm"
            >
                {({ errors }) => (
                    <>
                        <div>
                            <Label htmlFor="work_start">{t('settings.clocking.work.start')}</Label>
                            <Input type="time" name="work_start" defaultValue={settings.work_start || ''} />
                            <InputError message={errors.work_start} />
                        </div>

                        <div>
                            <Label htmlFor="work_end">{t('settings.clocking.work.end')}</Label>
                            <Input type="time" name="work_end" defaultValue={settings.work_end || ''} />
                            <InputError message={errors.work_end} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="lunch_start">{t('settings.clocking.lunch.start')}</Label>
                                <Input type="time" name="lunch_start" ref={lunchStartRef} defaultValue={settings.lunch_start || ''} />
                                <InputError message={errors.lunch_start} />
                            </div>

                            <div>
                                <Label htmlFor="lunch_end">{t('settings.clocking.lunch.end')}</Label>
                                <Input type="time" name="lunch_end" ref={lunchEndRef} defaultValue={settings.lunch_end || ''} />
                                <InputError message={errors.lunch_end} />
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button
                                type="button"
                                onClick={() => {
                                    if (lunchStartRef.current) lunchStartRef.current.value = '';
                                    if (lunchEndRef.current) lunchEndRef.current.value = '';
                                }}
                                className="rounded-lg bg-gray-200/50 px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-400/30 transition-all hover:bg-gray-300/60 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                            >
                                {t('settings.clocking.clear')}
                            </Button>

                            <Button
                                type="submit"
                                className="rounded-lg bg-pink-200/20 px-4 py-2 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                            >
                                {t('settings.clocking.save')}
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </div>
    );
}
