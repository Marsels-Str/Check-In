import { useCan } from '@/lib/can';
import type { User } from '@/types';
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
    businesses: any[];
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
            setError('Enter valid Unique ID.');
        }
    };

    const handleAddEmployee = async () => {
        if (!searchResult) return setError('Search for a user first!');
        if (isOwner && !businessId) return setError('Select a business first!');

        try {
            const res = await axios.post(route('users.employees.store'), {
                user_id: searchResult.id,
                ...(isOwner ? { business_id: businessId } : {}),
            });

            if (res.data.success) {
                setSearchResult(null);
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
        <div className="mb-8 rounded-lg border border-gray-400 p-6">
            <h2 className="mb-4 text-xl font-semibold">Add New Employee</h2>

            {isOwner && (
                <div className="mb-4 flex items-center gap-2">
                    <label className="font-medium">Business:</label>
                    <select
                        value={businessId ?? ''}
                        onChange={(e) => {
                            const id = Number(e.target.value);
                            setBusinessId(id);
                            router.get(route('users.employees.index'), { business_id: id });
                        }}
                        className="rounded border border-gray-400 bg-transparent px-3 py-2"
                    >
                        <option value="">-- Choose Business --</option>
                        {businesses.map((biz) => (
                            <option key={biz.id} value={biz.id}>
                                {biz.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {canAdd && (
                <form onSubmit={handleSearch} className="mb-4 flex flex-wrap gap-2">
                    <input
                        type="number"
                        value={uniqueId}
                        onChange={(e) => setUniqueId(e.target.value)}
                        placeholder="Search by Unique ID"
                        className="w-64 rounded border border-gray-400 px-3 py-2"
                    />
                    <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        Search
                    </button>
                </form>
            )}

            {error && <p className="mb-2 text-red-500">{error}</p>}
            {success && <p className="mb-2 text-green-500">{success}</p>}

            {searchResult && (
                <div className="rounded border border-gray-400 p-4">
                    <p>
                        <strong>{searchResult.name}</strong> ({searchResult.email})
                    </p>
                    <button onClick={handleAddEmployee} className="mt-3 inline-block rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                        Add
                    </button>
                </div>
            )}
        </div>
    );
}
