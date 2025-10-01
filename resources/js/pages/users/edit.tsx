import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'Edit User',
        href: '/users',
    },
];

export default function Edit({ user }: { user: any }) {
    type UserFormData = {
        name: string;
        email: string;
        password: string;
    };

    const { data, setData, put, errors } = useForm<UserFormData>({
        name: user.name || '',
        email: user.email || '',
        password: user.password || '',
    });

    function submit(e: React.SyntheticEvent) {
        e.preventDefault();
        put(route('users.update', user.id));
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

                <form onSubmit={submit}>
                    <div className="mx-auto w-full max-w-md space-y-6 rounded-md border border-gray-400 px-4 py-5 shadow-sm sm:p-6">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-400">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Name"
                            className="block w-full rounded-md border focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        {errors.name && <div className="text-sm text-red-500">{errors.name}</div>}

                        <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                            E-mail
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="E-mail"
                            className="block w-full rounded-md border focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        {errors.email && <div className="text-sm text-red-500">{errors.email}</div>}

                        <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                            className="block w-full rounded-md border focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        {errors.password && <div className="text-sm text-red-500">{errors.password}</div>}
                    </div>

                    <div className="py-2 text-center">
                        <button
                            type="submit"
                            className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
