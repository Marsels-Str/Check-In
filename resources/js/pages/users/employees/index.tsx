import AppLayout from '@/layouts/app-layout';
import { useCan } from '@/lib/can';
import { type BreadcrumbItem, User } from '@/types';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Employees', href: '/employees' }];

export default function Index({
    employees,
    currentUser,
    businesses,
    selectedBusinessId,
}: {
    employees: User[];
    currentUser: any;
    businesses: any[];
    selectedBusinessId: number | null;
}) {
    const [uniqueId, setUniqueId] = useState('');
    const [searchResult, setSearchResult] = useState<User | null>(null);
    const [businessId, setBusinessId] = useState<number | null>(selectedBusinessId ?? null);
    const [error, setError] = useState<string | null>(null);

    const isOwner = currentUser.roles?.some((r: any) => r.name === 'Owner');

    const canAdd = useCan('users.add');
    const canRemove = useCan('users.remove');

    const handleBusinessChange = (id: number) => {
        setBusinessId(id);
        router.get(route('users.employees.index'), { business_id: id });
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSearchResult(null);

        if (!uniqueId) {
            setError('Enter Unique ID!');
            return;
        }

        try {
            const res = await axios.get(route('employees.search'), {
                params: { unique_id: uniqueId },
            });
            if (res.data?.id) {
                setSearchResult(res.data);
            } else {
                setError('Enter valid Unique ID');
            }
        } catch {
            setError('Enter valid Unique ID');
        }
    };

    const handleAddEmployee = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!searchResult) {
            setError('Search for user first!');
            return;
        }

        if (isOwner && !businessId) {
            setError('Select a business first!');
            return;
        }

        try {
            const res = await axios.post(route('users.employees.store'), {
                user_id: searchResult.id,
                ...(isOwner ? { business_id: businessId } : {}),
            });

            if (res.data.success) {
                setSearchResult(null);
                setError(null);
                router.reload();
            } else if (res.data.error) {
                setError(res.data.error);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Unexpected error');
        }
    };

    const handleRemove = async (userId: number) => {
        try {
            const res = await axios.delete(route('users.employees.remove', userId), {
                data: isOwner ? { business_id: businessId } : {},
            });

            if (res.data.success) {
                router.reload();
            } else if (res.data.error) {
                setError(res.data.error);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Unexpected error');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employees" />
            <h1 className="mb-4 text-3xl font-bold">Employees</h1>

            {isOwner && (
                <div className="mb-4">
                    <label className="mr-2 font-semibold">Select Business:</label>
                    <select
                        value={businessId ?? ''}
                        onChange={(e) => {
                            const id = Number(e.target.value);
                            setBusinessId(id);
                            router.get(route('users.employees.index'), { business_id: id });
                        }}
                        className="rounded border px-3 py-2"
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
                <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                    <input
                        type="number"
                        value={uniqueId}
                        onChange={(e) => setUniqueId(e.target.value)}
                        placeholder="Search by Unique ID"
                        className="w-64 rounded border px-3 py-2"
                    />
                    <button
                        type="submit"
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Search
                    </button>
                </form>
            )}
            {error && <p className="text-red-500">{error}</p>}

            {searchResult && (
                <div className="mb-6 rounded border p-4">
                    <p>
                        <strong>{searchResult.name}</strong> ({searchResult.email})
                    </p>
                    {canAdd && (
                        <button
                            onClick={handleAddEmployee}
                            className="mt-2 inline-block rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
                        >
                            Add as Employee
                        </button>
                    )}
                </div>
            )}

            <table>
                <thead>
                    <tr className="text-xs text-gray-500 uppercase">
                        <th className="border-b border-gray-400 py-2">Id</th>
                        <th className="border-b border-gray-400">Name</th>
                        <th className="border-b border-gray-400">Email</th>
                        <th className="border-b border-gray-400">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp) => (
                        <tr key={emp.id} className="text-center">
                            <td className="border-b border-gray-400 py-2">{emp.id}</td>
                            <td className="border-b border-gray-400">{emp.name}</td>
                            <td className="border-b border-gray-400">{emp.email}</td>
                            <td className="border-b border-gray-400">
                                {canRemove && (
                                    <button
                                        onClick={() => handleRemove(emp.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </AppLayout>
    );
}
