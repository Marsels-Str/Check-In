import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

export default function CompleteProfile() {
    return (
        <>
            <Head title="Complete Profile" />

            <div className="mx-auto w-full max-w-lg px-4 py-10">
                <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm transition-all duration-300 dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm">
                    <h1 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">Complete your profile</h1>
                    <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">Please fill out your personal information to continue.</p>

                    <Form method="post" action={route('profile.complete.store')} className="space-y-5">
                        {({ errors }) => (
                            <>
                                <div>
                                    <Label htmlFor="age">Age</Label>
                                    <Input id="age" name="age" type="number" placeholder="14-100" />
                                    <InputError message={errors.age} />
                                </div>

                                <div>
                                    <Label htmlFor="height">Height (CM)</Label>
                                    <Input id="height" name="height" type="number" placeholder="100-300" />
                                    <InputError message={errors.height} />
                                </div>

                                <div>
                                    <Label htmlFor="weight">Weight (KG)</Label>
                                    <Input id="weight" name="weight" type="number" placeholder="40-700" />
                                    <InputError message={errors.weight} />
                                </div>

                                <div>
                                    <Label htmlFor="phone">Phone number</Label>
                                    <Input id="phone" name="phone" type="number" placeholder="8-15" />
                                    <InputError message={errors.phone} />
                                </div>

                                <div>
                                    <Label htmlFor="personal_code">Personal code</Label>
                                    <Input id="personal_code" name="personal_code" type="text" placeholder="000000-00000" />
                                    <InputError message={errors.personal_code} />
                                </div>

                                <div>
                                    <Label htmlFor="country">Country</Label>
                                    <Input id="country" name="country" type="text" placeholder="4-60 characters" />
                                    <InputError message={errors.country} />
                                </div>

                                <div>
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" name="city" type="text" placeholder="1-170 characters" />
                                    <InputError message={errors.city} />
                                </div>

                                <div>
                                    <Label htmlFor="portrait">Portrait (optional)</Label>
                                    <Input id="portrait" name="portrait" type="file" accept="image/*" />
                                    <InputError message={errors.portrait} />
                                </div>

                                <div className="pt-2 text-center">
                                    <Button
                                        type="submit"
                                        className="rounded-lg bg-pink-200/20 px-4 py-2 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </>
    );
}
