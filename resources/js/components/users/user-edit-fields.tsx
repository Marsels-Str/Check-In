import InputError from '@/components/input-error';
import { type User } from '@/types';
import { useForm } from '@inertiajs/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default function Edit({ user }: { user: User }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(route('users.update', user.id));
    }

    return (
        <div className="mx-auto w-full max-w-md">
            <form method="put" onSubmit={submit} className="space-y-6 rounded-lg px-6 py-6 shadow ring-1 ring-white/10 backdrop-blur-sm">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name" className="text-gray-300 dark:text-gray-100">
                            Name
                        </Label>
                        <Input id="name" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Full name" />
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="email" className="text-gray-300 dark:text-gray-100">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Email address"
                        />
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="password" className="text-gray-300 dark:text-gray-100">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Leave blank to keep current password"
                        />
                        <InputError message={errors.password} className="mt-1" />
                    </div>
                </div>

                <div className="pt-4 text-center">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                    >
                        {processing ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
