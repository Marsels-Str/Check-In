import BusinessDropdownMenu from '@/components/business-dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCan } from '@/lib/can';
import type { BusinessProfile, User } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function EmployeeSearchAndAdd({
    businesses,
    selectedBusinessId,
}: {
    businesses: BusinessProfile[];
    selectedBusinessId: number | null;
}) {
    const { flash, searchResult = null } = usePage<{ flash?: any; searchResult?: User | null }>().props;
    const [uniqueId, setUniqueId] = useState('');
    const [businessId, setBusinessId] = useState<number | null>(selectedBusinessId ?? businesses[0]?.id ?? null);
    const canAdd = useCan('employees.add');
    const canView = useCan('business.access');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!uniqueId.trim()) return;

        router.get(
            route('employees.search'),
            { unique_id: uniqueId },
            {
                only: ['searchResult'],
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleAddEmployee = () => {
        if (!searchResult) return;

        router.post(
            route('employees.store'),
            {
                user_id: searchResult.id,
                business_id: businessId,
            },
            {
                onSuccess: () => {
                    setUniqueId('');
                },
            },
        );

        setUniqueId('');
    };

    return (
        <div>
            {flash?.success && (
                <div className="mb-4 rounded-md bg-green-100 px-4 py-2 text-green-800 dark:bg-green-900 dark:text-green-300">{flash.success}</div>
            )}
            {flash?.error && <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-red-800 dark:bg-red-900 dark:text-red-300">{flash.error}</div>}

            <div className="borde mb-8 rounded-xl border p-6 shadow-sm backdrop-blur-sm transition">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Add New Employee</h2>
                        <p className="text-gray-500 dark:text-gray-400">Add or remove employees, check their activity.</p>
                    </div>

                    <div className="sm:self-start">
                        {canView && (
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
                    <form onSubmit={handleSearch} className="mb-4 flex flex-wrap items-center gap-3">
                        <Input
                            type="number"
                            name="unique_id"
                            value={uniqueId}
                            onChange={(e) => setUniqueId(e.target.value)}
                            placeholder="Enter employee Unique ID"
                            className="w-full max-w-xs rounded-lg border px-3 py-2 text-sm"
                        />
                        <Button
                            type="submit"
                            className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                        >
                            Search
                        </Button>
                    </form>
                )}

                {!!searchResult && (
                    <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                        <p className="font-medium text-gray-800 dark:text-gray-200">{searchResult.name}</p>
                        <Button
                            onClick={handleAddEmployee}
                            className="mt-3 inline-flex items-center rounded-lg bg-green-100/20 px-4 py-2 text-sm font-medium text-green-700 ring-1 ring-green-400/30 transition-all hover:bg-green-200/30 hover:text-green-800 dark:bg-green-900/40 dark:text-green-300 dark:ring-green-500/30 dark:hover:bg-green-900/30 dark:hover:text-green-200"
                        >
                            Add Employee
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
