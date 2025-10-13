import BussinesDropDownMenu from '@/components/business-dropdown-menu';
import { useCan } from '@/lib/can';
import type { BusinessProfile, User } from '@/types';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

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
    const [businessId, setBusinessId] = useState<number | null>(selectedBusinessId ?? null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const canAdd = useCan('users.add');

    useEffect(() => {
        if (!businessId && businesses.length > 0) {
            setBusinessId(selectedBusinessId ?? businesses[0].id ?? null);
        }
    }, [businesses, selectedBusinessId]);

    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError(null);
                setSuccess(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSearchResult(null);

        if (!uniqueId.trim()) {
            setError('Enter a Unique ID!');
            return;
        }

        try {
            const res = await axios.get(route('employees.search'), { params: { unique_id: uniqueId } });
            if (res.data?.id) setSearchResult(res.data);
            else setError('No user found with that ID.');
        } catch {
            setError('Enter a valid Unique ID.');
        }
    };

    const handleAddEmployee = async () => {
        if (!searchResult) return setError('Search for a user first!');
        if (isOwner && !businessId) return setError('Select a business first!');

        try {
            const res = await axios.post(route('employees.store'), {
                user_id: searchResult.id,
                ...(isOwner ? { business_id: businessId } : {}),
            });

            if (res.data.success) {
                setSearchResult(null);
                setUniqueId('');
                setError(null);
                setSuccess('Employee added successfully!');
                onReload();
            } else {
                setError(res.data.error || 'Could not add employee.');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Unexpected error');
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
                        <BussinesDropDownMenu
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

            {error && (
                <div className="mb-3 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 shadow-sm transition-opacity duration-500 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-3 rounded-lg border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-700 shadow-sm transition-opacity duration-500 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300">
                    {success}
                </div>
            )}

            {searchResult && (
                <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                    <p className="text-gray-800 dark:text-gray-200">
                        <strong>{searchResult.name}</strong>
                    </p>
                    <button
                        onClick={handleAddEmployee}
                        className="mt-3 inline-flex items-center rounded-lg bg-green-100/20 px-4 py-2 text-sm font-medium text-green-700 ring-1 ring-green-400/30 transition-all duration-300 hover:bg-green-200/30 hover:text-green-800 hover:ring-green-400/50 dark:bg-green-900/40 dark:text-green-300 dark:ring-green-500/30 dark:hover:bg-green-900/30 dark:hover:text-green-200 dark:hover:ring-green-500/50"
                    >
                        Add Employee
                    </button>
                </div>
            )}
        </div>
    );
}
