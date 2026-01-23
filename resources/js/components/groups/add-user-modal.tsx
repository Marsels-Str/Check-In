import { useT } from '@/lib/t';
import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

export default function AddUserModal({ isOpen, onClose, groupId, users }: any) {

    if (!isOpen) return null;

    const t = useT();

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-md">
            <div className="relative z-[100000] w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#0f0f0f] dark:text-gray-100">
                <Form method="post" action={route('groups.update-users', groupId)} className="space-y-4">
                    {({ errors }) => (
                        <>
                            <div className="space-y-2">

                                <div className="space-y-2">
                                    <h1 className="text-lg font-bold">{t('groups.show.users.add.label')}:</h1>
                                    <div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto">
                                        {users.map((user: any) => (
                                            <Label
                                                key={user.id}
                                                htmlFor={`user-${user.id}`}
                                                className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 hover:bg-gray-100 dark:border-gray-600 dark:bg-[#101010] dark:hover:bg-[#1a1a1a]"
                                            >
                                                <Input
                                                    type="checkbox"
                                                    name="user_ids[]"
                                                    value={user.id}
                                                    id={`user-${user.id}`}
                                                    className="h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400 dark:border-gray-500 dark:bg-gray-800 dark:focus:ring-yellow-500"
                                                />
                                                <span className="text-gray-800 dark:text-gray-200">{user.name}</span>
                                            </Label>
                                        ))}
                                    </div>
                                    <InputError message={errors.user_ids} />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-lg bg-gray-300/40 px-3.5 py-1.5 text-sm font-medium dark:bg-gray-700/40">
                                    {t('groups.show.users.add.cancel')}
                                </Button>

                                <Button
                                    type="submit"
                                    className="rounded-lg bg-pink-200/30 px-3.5 py-1.5 text-sm font-medium text-pink-700 dark:bg-pink-900/40 dark:text-pink-300">
                                    {t('groups.show.users.add.add')}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
}
