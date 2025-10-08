import { Link } from '@inertiajs/react';
import { useState } from 'react';
import AddUserModal from './add-user-modal';

export default function GroupUsers({ group, users, canAdd, canRemove }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="mt-6">
            <h2 className="text-lg font-semibold">Users in the group:</h2>

            <ul className="my-2">
                {group.users?.map((user: any) => (
                    <li key={user.id} className="flex items-center">
                        <span>{user.name}</span>
                        {canRemove && (
                            <Link
                                href={route('job-groups.removeUser', { group: group.id, user: user.id })}
                                method="delete"
                                as="button"
                                className="ml-2 text-red-500 hover:text-red-700"
                            >
                                Remove
                            </Link>
                        )}
                    </li>
                ))}
            </ul>

            {canAdd && (
                <button onClick={() => setIsModalOpen(true)} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
                    Add
                </button>
            )}

            <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} groupId={group.id} users={users} />
        </div>
    );
}
