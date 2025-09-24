import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

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
            <Head title="User Create"/>
                <div>
                    <Link
                        href={route('users.index')}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Back
                    </Link>

                    <form onSubmit={submit} className="border border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6 rounded-md shadow-sm space-y-6 mx-auto w-full max-w-md">

                        <div className="space-y-3">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder='Name'
                                className="border focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md sm:text-sm"/>
                            {errors.name && <div className="text-sm text-red-600">{errors.name}</div>}

                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                E-mail
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder='E-mail'
                                className="border focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md sm:text-sm"/>
                            {errors.email && <div className="text-sm text-red-600">{errors.email}</div>}

                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder='Password'
                                className="border focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md sm:text-sm"/>
                            {errors.password && <div className="text-sm text-red-600">{errors.password}</div>}
                        </div>

                        <div className="text-center">
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Save
                            </button>
                        </div>

                    </form>
                </div>
            
        </AppLayout>
    );
}
