import { useT } from '@/lib/t';
import { User } from '@/types';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    groupId: number;
    users: User[];
}

export default function AddUserModal({ isOpen, onClose, groupId, users }: Props) {
    if (!isOpen) return null;

    const t = useT();

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-md">
            <div className="w-full max-w-md rounded-xl border bg-background p-2">
                <Form method="post" action={route('groups.update-users', groupId)} className="space-y-4">
                    {({ errors }) => (
                        <>
                            <div>
                                <h1 className="text-lg font-bold">{t('groups.show.users.add.label')}:</h1>
                                <div>
                                    {users.map((user: any) => (
                                        <Label
                                            key={user.id}
                                            htmlFor={`user-${user.id}`}
                                            className="flex cursor-pointer space-x-2 rounded-lg border bg-background px-4 py-2 hover:bg-muted"
                                        >
                                            <Input type="checkbox" name="user_ids[]" value={user.id} id={`user-${user.id}`} className="h-4 w-4" />
                                            <span className="dark:text-white">{user.name}</span>
                                        </Label>
                                    ))}
                                </div>
                                <InputError message={errors.user_ids} />
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button variant="destructive" onClick={onClose}>
                                    {t('groups.show.users.add.cancel')}
                                </Button>

                                <Button variant="default">{t('groups.show.users.add.add')}</Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
}
