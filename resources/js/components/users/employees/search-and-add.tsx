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
        <div>
            <div className="borde mb-8 rounded-xl border p-6 shadow-sm backdrop-blur-sm transition">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('employees.search.label')}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{t('employees.search.description')}</p>
                    </div>

                    <div className="sm:self-start">
                        {canAccess && (
                            <BusinessDropdownMenu
                                businesses={businesses}
                                selectedBusinessId={businessId}
                                onChange={(id) => {
                                    const newId = Number(id);
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
                                    <Button
                                        type="submit"
                                        className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                                    >
                                        {t('employees.search.search')}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                )}

                {!!searchResult && (
                    <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                        <p className="font-medium text-gray-800 dark:text-gray-200">{searchResult.name}</p>
                        <Button
                            onClick={() => addEmployee(searchResult, businessId)}
                            className="mt-3 inline-flex items-center rounded-lg bg-green-100/20 px-4 py-2 text-sm font-medium text-green-700 ring-1 ring-green-400/30 transition-all hover:bg-green-200/30 hover:text-green-800 dark:bg-green-900/40 dark:text-green-300 dark:ring-green-500/30 dark:hover:bg-green-900/30 dark:hover:text-green-200"
                        >
                            {t('employees.search.add')}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
