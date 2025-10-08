import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Create',
        href: '/users',
    },
];

export default function Create() {
    const { data, setData, post, errors } = useForm({
        name: '',
        email: '',
        password: '',
    });

    function submit(e: React.SyntheticEvent) {
        e.preventDefault();
        post(route('users.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Create" />
            <div>
                <Link
                    href={route('users.index')}
                    className="inline-flex items-center rounded border border-transparent bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                    Back
                </Link>

                <form
                    onSubmit={submit}
                    className="mx-auto w-full max-w-md space-y-6 rounded-md border border-gray-200 px-4 py-5 shadow-sm sm:p-6 dark:border-gray-700"
                >
                    <div className="space-y-3">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Name"
                            className="block w-full rounded-md border focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        {errors.name && <div className="text-sm text-red-600">{errors.name}</div>}

                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            E-mail
                        </label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="E-mail"
                            className="block w-full rounded-md border focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        {errors.email && <div className="text-sm text-red-600">{errors.email}</div>}

                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                            className="block w-full rounded-md border focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        {errors.password && <div className="text-sm text-red-600">{errors.password}</div>}
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
