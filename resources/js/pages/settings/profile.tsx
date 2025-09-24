import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import IDCard from '@/components/id-card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <div className='relative'>
                <div className='py-2 px-2 md:hidden'>
                    <IDCard user={auth.user} />
                </div>

                <div className='hidden md:block absolute right-0 top-0 py-6 px-2'>
                    <IDCard user={auth.user} />
                </div>
            <SettingsLayout>
                    <div className="space-y-6">
                        <HeadingSmall title="Profile information" description="Update your name and email address" />

                        <Form
                            method="patch"
                            action={route('profile.update')}
                            options={{
                                preserveScroll: true,
                            }}
                            className="space-y-6"
                        >
                            {({ processing, recentlySuccessful, errors }) => (
                                <>
                                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                        <div>
                                            <Label htmlFor="name">Name</Label>

                                            <Input
                                                id="name"
                                                className="mt-1 block w-full"
                                                defaultValue={auth.user.name}
                                                name="name"
                                                autoComplete="name"
                                                placeholder="Full name"
                                            />

                                            <InputError className="mt-2" message={errors.name} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email address</Label>

                                            <Input
                                                id="email"
                                                type="email"
                                                className="mt-1 block w-full"
                                                defaultValue={auth.user.email}
                                                name="email"
                                                autoComplete="username"
                                                placeholder="Email address"
                                            />

                                            <InputError className="mt-2" message={errors.email} />
                                        </div>

                                        <div>
                                            <Label htmlFor="age">Age</Label>

                                            <Input
                                                id="age"
                                                className="mt-1 block w-full"
                                                defaultValue={auth.user.profile?.age}
                                                name="age"
                                                autoComplete="age"
                                                placeholder="Age"
                                            />

                                            <InputError className="mt-2" message={errors.age} />
                                        </div>

                                        <div>
                                            <Label htmlFor="height">Height</Label>

                                            <Input
                                                id="height"
                                                className="mt-1 block w-full"
                                                defaultValue={auth.user.profile?.height}
                                                name="height"
                                                autoComplete="height"
                                                placeholder="Height in CM"
                                            />

                                            <InputError className="mt-2" message={errors.height} />
                                        </div>

                                        <div>
                                            <Label htmlFor="weight">Weight</Label>

                                            <Input
                                                id="weight"
                                                className="mt-1 block w-full"
                                                defaultValue={auth.user.profile?.weight}
                                                name="weight"
                                                autoComplete="weight"
                                                placeholder="Weight in KG"
                                            />

                                            <InputError className="mt-2" message={errors.weight} />
                                        </div>

                                        <div>
                                            <Label htmlFor="phone">Phone</Label>

                                            <Input
                                                id="phone"
                                                className="mt-1 block w-full"
                                                defaultValue={auth.user.profile?.phone}
                                                name="phone"
                                                autoComplete="phone"
                                                placeholder="Phone number"
                                            />

                                            <InputError className="mt-2" message={errors.phone} />
                                        </div>

                                        <div>
                                            <Label htmlFor="personal_code">Personal Code</Label>

                                            <Input
                                                id="personal_code"
                                                className="mt-1 block w-full"
                                                defaultValue={auth.user.profile?.personal_code}
                                                name="personal_code"
                                                autoComplete="personal_code"
                                                placeholder="Personal code (000000-00000)"
                                            />

                                            <InputError className="mt-2" message={errors.personal_code} />
                                        </div>

                                        <div>
                                            <Label htmlFor="country">Country</Label>

                                            <Input
                                                id="country"
                                                className="mt-1 block w-full"
                                                defaultValue={auth.user.profile?.country}
                                                name="country"
                                                autoComplete="country"
                                                placeholder="Country"
                                            />

                                            <InputError className="mt-2" message={errors.country} />
                                        </div>

                                        <div>
                                            <Label htmlFor="city">City</Label>

                                            <Input
                                                id="city"
                                                className="mt-1 block w-full"
                                                defaultValue={auth.user.profile?.city}
                                                name="city"
                                                autoComplete="city"
                                                placeholder="City"
                                            />

                                            <InputError className="mt-2" message={errors.city} />
                                        </div>
                                    

                                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                                            <div>
                                                <p className="-mt-4 text-sm text-muted-foreground">
                                                    Your email address is unverified.{' '}
                                                    <Link
                                                        href={route('verification.send')}
                                                        method="post"
                                                        as="button"
                                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                    >
                                                        Click here to resend the verification email.
                                                    </Link>
                                                </p>

                                                {status === 'verification-link-sent' && (
                                                    <div className="mt-2 text-sm font-medium text-green-600">
                                                        A new verification link has been sent to your email address.
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4">
                                            <Button disabled={processing} className='mt-7 w-full'>Save</Button>

                                            <Transition
                                                show={recentlySuccessful}
                                                enter="transition ease-in-out"
                                                enterFrom="opacity-0"
                                                leave="transition ease-in-out"
                                                leaveTo="opacity-0"
                                            >
                                                <p className="text-sm text-neutral-600">Saved</p>
                                            </Transition>
                                        </div>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                

                <DeleteUser />
            </SettingsLayout>
            </div>
        </AppLayout>
    );
}
