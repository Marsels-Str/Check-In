import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { can } from '@/lib/can';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Groups',
        href: '/job-groups',
    },
    {
        title: 'Show Group',
        href: '/job-groups',
    },
];

export default function Show({ group, users, errors }: { group: any, users: any, errors: any }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleUserSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const users = e.currentTarget.elements.namedItem('users') as HTMLSelectElement;
        const selectedUsers = Array.from(users.selectedOptions).map(option => Number(option.value));

        if (selectedUsers.length === 0) {
            setError('Please select at least one user.');
            return;
        }

        setError(null);
        router.post(route('job-groups.updateUsers', group.id), { users: selectedUsers });
        setIsModalOpen(false);
    }

    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this image?')) {
            router.delete(route('groupImages.destroy', id));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Group Show"/>
            
            <div>
                <Link
                    href={route('job-groups.index')}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Back
                </Link>
            </div>

            <div>
                <p><strong>Name:</strong> {group.name}</p>
                <p><strong>Description:</strong> {group.description}</p>
            </div>

            <h1 className="py-4 text-xl">Users in the group:</h1>

            {group.users?.map((user: any) => (
                    <li key={user.id} className="flex items-center">
                        <span className="mr-2">{user.name}</span>
                    </li>
                ))}
            
            <div>
                {can('users.add') &&
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="rounded-sm px-4 py-2 text-white bg-blue-500 hover:bg-blue-700">
                        Add
                    </button>
                }
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-600 z-50">
                    <div className="bg-gray-400 dark:bg-gray-700 rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-3xl text-gray-700 dark:text-gray-400">
                            Select Users
                        </h2>

                        <form onSubmit={handleUserSubmit}>
                            <select
                                name="users" multiple className="w-full text-gray-700 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-400 rounded-lg">
                                {users.map((user: any) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>

                            {error && (
                                <p className="text-red-600 text-xl">{error}</p>
                            )}

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-red-400 text-black rounded hover:bg-red-500">
                                    Cancel
                                </button>

                                <button
                                    type="submit" className="px-4 py-2 bg-blue-400 text-black rounded hover:bg-blue-500">
                                    Add Selected
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            <form className="px-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    router.post(route('job-groups.images.store', { jobGroup: group.id }), formData, {
                    forceFormData: true,
                    onError: (errors) => console.error(errors),
                    });
                }}
            >
                <input type="file" name="image" accept="image/*" className='border border-gray-400 rounded-lg px-2'/>
                {errors.image && <div className="text-sm text-red-500 text-center">{errors.image}</div>}
                <button type="submit" className='px-4 py-2 bg-blue-400 text-black rounded hover:bg-blue-500'>Upload</button>
            </form>

            <div className="mt-4 grid grid-cols-3 gap-4">
                {group.images?.map((img: any) => (
                    <div key={img.id} className="relative">
                        <img src={`data:image/jpeg;base64,${img.image_blob}`} className="rounded-lg shadow-md"/>
                        
                        <button onClick={() => handleDelete(img.id)} className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
