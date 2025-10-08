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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">Add Users to Group</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="users" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Select one or more users:
                        </label>
                        <select
                            id="users"
                            name="users"
                            multiple
                            className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-800 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
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
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg bg-gray-300 px-4 py-2 text-gray-800 transition hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
