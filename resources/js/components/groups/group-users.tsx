import { useT } from '@/lib/t';
import { useState } from 'react';
import { useCan } from '@/lib/can';
import { User, Group } from '@/types';
import { router } from '@inertiajs/react';
import AddUserModal from './add-user-modal';
import { Button } from '@/components/ui/button';

interface Props {
    group: Group;
    users: User[];
}

export default function GroupUsers({ group, users }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const canAddUsers = useCan('groups.addUsers');
    const canRemoveUsers = useCan('groups.removeUsers');

    const t = useT();

    const userRemove = (user: User) => {
        router.delete(route('groups.remove-users', { group: group.id, user: user.id }));
    };

    return (
        <div className="mt-6">
            <h2 className="text-lg font-semibold">{t('groups.show.users.label')}:</h2>

            <ul className="my-2">
                {group.users?.map((user: User) => (
                    <li key={user.id} className="flex items-center">
                        <span>{user.name}</span>
                        {canRemoveUsers && (
                            <Button
                                onClick={() => userRemove(user)}
                                variant="link"
                                className="text-destructive"
                            >
                                {t('groups.show.users.remove')}
                            </Button>
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
