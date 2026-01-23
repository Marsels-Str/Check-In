import { useT } from '@/lib/t';
import { useState } from 'react';
import { useCan } from '@/lib/can';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AddUserModal from './add-user-modal';

export default function GroupUsers({ group, users }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const canAddUsers = useCan('groups.addUsers');
    const canRemoveUsers = useCan('groups.removeUsers');

    const t = useT();

    return (
        <div className="mt-6">
            <h2 className="text-lg font-semibold">{t('groups.show.users.label')}:</h2>

            <ul className="my-2">
                {group.users?.map((user: any) => (
                    <li key={user.id} className="flex items-center">
                        <span>{user.name}</span>
                        {canRemoveUsers && (
                            <Link
                                href={route('groups.remove-users', { group: group.id, user: user.id })}
                                method="delete"
                                as="button"
                                className="ml-2 text-red-500 hover:text-red-700"
                            >
                                {t('groups.show.users.remove')}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>

            {canAddUsers && (
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                >
                    {t('groups.show.users.add')}
                    {/* Add User (Priekš testa atkomentēt) */}
                </Button>
            )}

            <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} groupId={group.id} users={users} />
        </div>
    );
}
