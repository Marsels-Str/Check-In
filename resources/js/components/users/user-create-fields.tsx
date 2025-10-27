import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

export default function UserCreateFields() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('users.store'));
    }

    return (
        <div className="mx-auto w-full max-w-md">
            <form method="post" onSubmit={submit} className="space-y-6 rounded-lg px-6 py-6">
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
                            placeholder="Password"
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
                        {processing ? 'Saving...' : 'Create'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
