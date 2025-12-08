import InputError from '@/components/input-error';
import type { UserProfile } from '@/types';
import { Form } from '@inertiajs/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default function UserProfileFields({ user_profile }: { user_profile: UserProfile }) {
    return (
        <div className="mx-auto w-full max-w-md">
            <Form
                method="patch"
                action={route('users.update-user-profile', user_profile.user_id)}
                className="space-y-6 rounded-xl border px-6 py-6 shadow-md backdrop-blur-sm"
            >
                {({ errors }) => (
                    <>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="age">Age</Label>
                                <Input id="age" type="number" name="age" defaultValue={user_profile.age} placeholder="14-100" />
                                <InputError message={errors.age} />
                            </div>

                            <div>
                                <Label htmlFor="height">Height (cm)</Label>
                                <Input id="height" type="number" name="height" defaultValue={user_profile.height} placeholder="100-300" />
                                <InputError message={errors.height} />
                            </div>

                            <div>
                                <Label htmlFor="weight">Weight (kg)</Label>
                                <Input id="weight" type="number" name="weight" defaultValue={user_profile.weight} placeholder="40-700" />
                                <InputError message={errors.weight} />
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" type="text" name="phone" defaultValue={user_profile.phone} placeholder="8-15" />
                                <InputError message={errors.phone} />
                            </div>

                            <div>
                                <Label htmlFor="personal_code">Personal Code</Label>
                                <Input
                                    id="personal_code"
                                    type="text"
                                    name="personal_code"
                                    defaultValue={user_profile.personal_code}
                                    placeholder="000000-00000"
                                />
                                <InputError message={errors.personal_code} />
                            </div>

                            <div>
                                <Label htmlFor="country">Country</Label>
                                <Input id="country" type="text" name="country" defaultValue={user_profile.country} placeholder="4-60 characters" />
                                <InputError message={errors.country} />
                            </div>

                            <div>
                                <Label htmlFor="city">City</Label>
                                <Input id="city" type="text" name="city" defaultValue={user_profile.city} placeholder="1-170 characters" />
                                <InputError message={errors.city} />
                            </div>
                        </div>

                        <div className="pt-4 text-center">
                            <Button
                                type="submit"
                                className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                            >
                                Save
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </div>
    );
}
