import axios from 'axios';
import { useCan } from '@/lib/can';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { BusinessProfile, User } from '@/types';
import BusinessDropdownMenu from '@/components/business-dropdown-menu';

export default function EmployeeSearchAndAdd({
    isOwner,
    businesses,
    selectedBusinessId,
    onReload,
}: {
    isOwner: boolean;
    businesses: BusinessProfile[];
    selectedBusinessId: number | null;
    onReload: () => void;
}) {
    const [uniqueId, setUniqueId] = useState('');
    const [searchResult, setSearchResult] = useState<User | null>(null);
    const [businessId, setBusinessId] = useState<number | null>(selectedBusinessId ?? businesses[0]?.id ?? null);
    const [alert, setAlert] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

    const canAdd = useCan('users.add');

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => setAlert(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setAlert(null);
        setSearchResult(null);

        if (!uniqueId.trim()) return setAlert({ type: 'error', message: 'Enter a Unique ID!' });

        try {
            const { data } = await axios.get(route('employees.search'), { params: { unique_id: uniqueId } });
            data?.id ? setSearchResult(data) : setAlert({ type: 'error', message: 'No user found with that ID.' });
        } catch {
            setAlert({ type: 'error', message: 'Enter a valid Unique ID.' });
        }
    };

    const handleAddEmployee = async () => {
        if (!searchResult) return setAlert({ type: 'error', message: 'Search for a user first!' });
        if (isOwner && !businessId) return setAlert({ type: 'error', message: 'Select a business first!' });

        try {
            const { data } = await axios.post(route('employees.store'), {
                user_id: searchResult.id,
                ...(isOwner ? { business_id: businessId } : {}),
            });

            if (data.success) {
                setUniqueId('');
                setSearchResult(null);
                setAlert({ type: 'success', message: 'Employee added successfully!' });
                onReload();
            } else {
                setAlert({ type: 'error', message: data.error || 'Could not add employee.' });
            }
        } catch (err: any) {
            setAlert({ type: 'error', message: err.response?.data?.error || 'Unexpected error' });
        }
    };

    return (
        <div className="borde mb-8 rounded-xl border p-6 shadow-sm backdrop-blur-sm transition">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Add New Employee</h2>
                    <p className="text-gray-500 dark:text-gray-400">Add or remove employees, check their activity.</p>
                </div>

                {isOwner && businesses.length > 0 && (
                    <div className="sm:self-start">
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
                    </div>
                )}
            </div>

            {canAdd && (
                <form onSubmit={handleSearch} className="mb-4 flex flex-wrap items-center gap-3">
                    <input
                        type="number"
                        name="unique_id"
                        value={uniqueId}
                        onChange={(e) => setUniqueId(e.target.value)}
                        placeholder="Enter employee Unique ID"
                        className="w-full max-w-xs rounded-lg border px-3 py-2 text-sm"
                    />
                    <button
                        type="submit"
                        className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                    >
                        Search
                    </button>
                </form>
            )}

            {alert && (
                <div
                    className={`mb-3 rounded-lg border px-4 py-2 text-sm shadow-sm transition-opacity duration-500 ${
                        alert.type === 'error'
                            ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300'
                            : 'border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300'
                    }`}
                >
                    {alert.message}
                </div>
            )}

            {searchResult && (
                <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                    <p className="font-medium text-gray-800 dark:text-gray-200">{searchResult.name}</p>
                    <button
                        onClick={handleAddEmployee}
                        className="mt-3 inline-flex items-center rounded-lg bg-green-100/20 px-4 py-2 text-sm font-medium text-green-700 ring-1 ring-green-400/30 transition-all hover:bg-green-200/30 hover:text-green-800 dark:bg-green-900/40 dark:text-green-300 dark:ring-green-500/30 dark:hover:bg-green-900/30 dark:hover:text-green-200"
                    >
                        Add Employee
                    </button>
                </div>
            )}
        </div>
    );
}
