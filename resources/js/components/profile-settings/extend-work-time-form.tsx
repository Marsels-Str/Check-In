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
        <>
            <Form method="post" action={route('auto-clock.extend')} className="space-y-4 rounded-xl border bg-background p-2 shadow-xl">
                {({ errors }) => (
                    <>
                        <Label>{t('settings.clocking.extend.label')}</Label>
                        <p className="text-muted-foreground">{t('settings.clocking.extend.description')}</p>

                        <Input
                            type="number"
                            name="extended_minutes"
                            id="extended_minutes"
                            value={extendedMinutes}
                            onChange={(e) => setExtendedMinutes(e.target.value)}
                        />
                        <InputError message={errors.extended_minutes} />

                        <div className="flex justify-center">
                            <Button variant="default">{t('settings.clocking.extend.save')}</Button>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}
