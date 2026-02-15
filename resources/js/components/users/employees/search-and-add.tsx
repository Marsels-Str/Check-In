import { useT } from '@/lib/t';
import { useState } from 'react';
import { useCan } from '@/lib/can';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BusinessProfile, User } from '@/types';
import InputError from '@/components/input-error';
import { router, usePage } from '@inertiajs/react';
import BusinessDropdownMenu from '@/components/business-dropdown-menu';

interface Props {
    businesses: BusinessProfile[];
    selectedBusinessId: number | null;
}

export default function EmployeeSearchAndAdd({ businesses, selectedBusinessId }: Props) {
    const { searchResult = null } = usePage<{ searchResult?: User | null }>().props;
    const [businessId, setBusinessId] = useState<number | null>(selectedBusinessId ?? null);
    const canAdd = useCan('employees.add');
    const canAccess = useCan('business.access');

    const addEmployee = (user: User, businessId: number | null) => {
        router.post(route('employees.store'), {
            user_id: user.id,
            business_id: businessId,
        });
    };

    const t = useT();

    return (
        <div className="max-w-lg mx-auto">
            <div className="border rounded-xl p-2 shadow-md space-y-2">
                <div className="flex space-y-2 justify-between">
                    <div>
                        <h2 className="text-xl font-bold dark:text-white">{t('employees.search.label')}</h2>
                        <p className="text-sm text-muted-foreground">{t('employees.search.description')}</p>
                    </div>

                    <div>
                        {canAccess && (
                            <BusinessDropdownMenu
                                businesses={businesses}
                                selectedBusinessId={businessId}

                                onChange={(id) => {
                                    const newId = id ? Number(id) : null;
                                    setBusinessId(newId);

                                    router.visit(route('employees.index'), {
                                        data: { business_id: newId },
                                        only: ['employees', 'selectedBusinessId'],
                                        preserveScroll: true,
                                    });
                                }}
                            />
                        )}
                    </div>
                </div>

                {canAdd && (
                    <Form method="post" action={route('employees.search')} className="flex">
                        {({ errors }) => (
                            <>
                                <div>
                                    <Input
                                        id="unique_id"
                                        type="number"
                                        name="unique_id"
                                        placeholder="00000000"
                                    />
                                    <InputError message={errors.unique_id} />
                                </div>

                                <div className="ml-4">
                                    <Button type="submit" variant="default">
                                        {t('employees.search.search')}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                )}

                {!!searchResult && (
                    <div className="rounded-lg border bg-muted p-2">
                        <p className="dark:text-white">{searchResult.name}</p>
                        <Button variant="default" onClick={() => addEmployee(searchResult, businessId)}>
                            {t('employees.search.add')}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
