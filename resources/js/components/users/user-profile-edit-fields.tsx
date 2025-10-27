import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import type { UserProfile } from '@/types';
import { useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';

export default function UserProfileFields({ user_profile }: { user_profile: UserProfile }) {
    const { data, setData, patch, processing, errors } = useForm<UserProfile>({
        age: user_profile.age || '',
        height: user_profile.height || '',
        weight: user_profile.weight || '',
        phone: user_profile.phone || '',
        personal_code: user_profile.personal_code || '',
        country: user_profile.country || '',
        city: user_profile.city || '',
        portrait: null,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        patch(route('users.update-user-profile', user_profile.user_id));
    }

    return (
        <div className="mx-auto w-full max-w-md">
            <form onSubmit={submit} className="space-y-6 rounded-xl border px-6 py-6 shadow-md backdrop-blur-sm">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="age" className="text-gray-800 dark:text-gray-100">
                            Age
                        </Label>
                        <Input
                            type="number"
                            id="age"
                            name="age"
                            value={data.age || ''}
                            onChange={(e) => setData('age', e.target.value)}
                            placeholder="14-100"
                        />
                        <InputError message={errors.age} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="height" className="text-gray-800 dark:text-gray-100">
                            Height (cm)
                        </Label>
                        <Input
                            type="number"
                            id="height"
                            name="height"
                            value={data.height || ''}
                            onChange={(e) => setData('height', e.target.value)}
                            placeholder="100-300"
                        />
                        <InputError message={errors.height} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="weight" className="text-gray-800 dark:text-gray-100">
                            Weight (kg)
                        </Label>
                        <Input
                            type="number"
                            id="weight"
                            name="weight"
                            value={data.weight || ''}
                            onChange={(e) => setData('weight', e.target.value)}
                            placeholder="40-700"
                        />
                        <InputError message={errors.weight} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="phone" className="text-gray-800 dark:text-gray-100">
                            Phone
                        </Label>
                        <Input
                            type="text"
                            id="phone"
                            name="phone"
                            value={data.phone || ''}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="8-15"
                        />
                        <InputError message={errors.phone} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="personal_code" className="text-gray-800 dark:text-gray-100">
                            Personal Code
                        </Label>
                        <Input
                            type="text"
                            id="personal_code"
                            name="personal_code"
                            value={data.personal_code || ''}
                            onChange={(e) => setData('personal_code', e.target.value)}
                            placeholder="000000-00000"
                        />
                        <InputError message={errors.personal_code} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="country" className="text-gray-800 dark:text-gray-100">
                            Country
                        </Label>
                        <Input
                            type="text"
                            id="country"
                            name="country"
                            value={data.country || ''}
                            onChange={(e) => setData('country', e.target.value)}
                            placeholder="4-60 characters"
                        />
                        <InputError message={errors.country} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="city" className="text-gray-800 dark:text-gray-100">
                            City
                        </Label>
                        <Input
                            type="text"
                            id="city"
                            name="city"
                            value={data.city || ''}
                            onChange={(e) => setData('city', e.target.value)}
                            placeholder="1-170 characters"
                        />
                        <InputError message={errors.city} className="mt-1" />
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
