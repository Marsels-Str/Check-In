import { useT } from '@/lib/t';
import { useRef } from 'react';
import { Form } from '@inertiajs/react';
import { ClockingSettings } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

interface Props {
    settings: ClockingSettings;
}

export default function AutoClockForm({ settings }: Props) {
    const lunchStartRef = useRef<HTMLInputElement>(null);
    const lunchEndRef = useRef<HTMLInputElement>(null);

    const t = useT();

    return (
        <>
            <Form method="put" action={route('auto-clock.update')}>
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

                        <div className="mt-4 flex justify-between">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => {
                                    if (lunchStartRef.current) lunchStartRef.current.value = '';
                                    if (lunchEndRef.current) lunchEndRef.current.value = '';
                                }}
                            >
                                {t('settings.clocking.clear')}
                            </Button>

                            <Button variant="default">{t('settings.clocking.save')}</Button>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}
