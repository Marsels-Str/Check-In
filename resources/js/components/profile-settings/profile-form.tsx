import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, Link } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

export default function ProfileForm({ user, mustVerifyEmail, status }: { user: any; mustVerifyEmail: boolean; status?: string }) {
    return (
        <Form method="patch" action={route('profile.update')} options={{ preserveScroll: true }} className="space-y-6">
            {({ processing, recentlySuccessful, errors }) => (
                <>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" defaultValue={user.name} placeholder="Full name" />
                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" name="email" defaultValue={user.email} placeholder="Email" />
                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        <div>
                            <Label htmlFor="age">Age</Label>
                            <Input id="age" name="age" defaultValue={user.profile?.age} placeholder="Age" />
                            <InputError className="mt-2" message={errors.age} />
                        </div>

                        <div>
                            <Label htmlFor="height">Height</Label>
                            <Input id="height" name="height" defaultValue={user.profile?.height} placeholder="Height in CM" />
                            <InputError className="mt-2" message={errors.height} />
                        </div>

                        <div>
                            <Label htmlFor="weight">Weight</Label>
                            <Input id="weight" name="weight" defaultValue={user.profile?.weight} placeholder="Weight in KG" />
                            <InputError className="mt-2" message={errors.weight} />
                        </div>

                        <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" defaultValue={user.profile?.phone} placeholder="Phone number" />
                            <InputError className="mt-2" message={errors.phone} />
                        </div>

                        <div>
                            <Label htmlFor="personal_code">Personal Code</Label>
                            <Input id="personal_code" name="personal_code" defaultValue={user.profile?.personal_code} placeholder="000000-00000" />
                            <InputError className="mt-2" message={errors.personal_code} />
                        </div>

                        <div>
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" name="country" defaultValue={user.profile?.country} placeholder="Country" />
                            <InputError className="mt-2" message={errors.country} />
                        </div>

                        <div>
                            <Label htmlFor="city">City</Label>
                            <Input id="city" name="city" defaultValue={user.profile?.city} placeholder="City" />
                            <InputError className="mt-2" message={errors.city} />
                        </div>
                    </div>

                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Your email is unverified.{' '}
                                <Link href={route('verification.send')} method="post" as="button" className="text-foreground underline">
                                    Resend verification email
                                </Link>
                            </p>
                            {status === 'verification-link-sent' && (
                                <div className="mt-2 text-sm font-medium text-green-600">A new verification link has been sent to your email.</div>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <Button
                            disabled={processing}
                            className="inline-flex w-full items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                        >
                            Save Profile
                        </Button>
                        <Transition show={recentlySuccessful}>
                            <p className="text-sm text-neutral-600">Saved</p>
                        </Transition>
                    </div>
                </>
            )}
        </Form>
    );
}
