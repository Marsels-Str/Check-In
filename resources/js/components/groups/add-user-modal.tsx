import { Button } from '@headlessui/react';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function AddUserModal({ isOpen, onClose, groupId, users }: any) {
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const select = e.currentTarget.elements.namedItem('users') as HTMLSelectElement;
        const selected = Array.from(select.selectedOptions).map((opt) => Number(opt.value));

        if (!selected.length) {
            setError('Please select at least one user.');
            return;
        }

        router.post(route('job-groups.update-users', groupId), { user_ids: selected });
        onClose();
    };

    return (
        <>
            {/* Full-screen overlay */}
            <div
                className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-300"
                style={{ pointerEvents: 'auto' }}
            >
                {/* Modal Box */}
                <div className="relative z-[100000] w-full max-w-md rounded-2xl border border-gray-200 bg-white/95 p-6 shadow-2xl backdrop-blur-sm dark:border-white/10 dark:bg-[#0f0f0f]/90 dark:text-gray-100">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">Available Users</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="users" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Select one:
                            </label>
                            <select
                                id="users"
                                name="users"
                                multiple
                                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-800 shadow-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 dark:border-gray-600 dark:bg-[#101010] dark:text-gray-100 dark:focus:border-yellow-500 dark:focus:ring-yellow-500"
                            >
                                {users.map((user: any) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                type="button"
                                onClick={onClose}
                                className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                            >
                                Add
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
