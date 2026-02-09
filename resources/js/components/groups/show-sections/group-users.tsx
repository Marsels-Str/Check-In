import { useT } from '@/lib/t';
import { useState } from 'react';
import { useCan } from '@/lib/can';
import { User, GroupUser } from '@/types';
import { router } from '@inertiajs/react';
import AddUserModal from './add-user-modal';
import { Button } from '@/components/ui/button';

interface Props {
    group: GroupUser;
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
        <div>
            <h2 className="text-lg font-bold">{t('groups.show.users.label')}:</h2>

            <ul>
                {group.users?.map((user: User) => (
                    <li key={user.id} className="flex items-center">
                        <span>{user.name}</span>
                        {canRemoveUsers && (
                            <Button variant="link" className="text-red-700 dark:text-red-500" onClick={() => userRemove(user)}>
                                {t('groups.show.users.remove')}
                            </Button>
                        )}
                    </li>
                ))}
            </ul>

            {canAddUsers && (
                <Button variant="default" onClick={() => setIsModalOpen(true)}>
                    {t('groups.show.users.add')}
                    {/* Add User (Priekš testa atkomentēt) */}
                </Button>
            )}

            <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} groupId={group.id} users={users} />
        </div>
    );
}
