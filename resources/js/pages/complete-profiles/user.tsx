import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';

export default function CompleteProfile() {
    const { data, setData, post, errors, processing } = useForm({
        age: '',
        height: '',
        weight: '',
        phone: '',
        personal_code: '',
        country: '',
        city: '',
        portrait: null as File | null,
    });

    function submit(e: React.SyntheticEvent) {
        e.preventDefault();
        post(route('profile.complete.store'), { forceFormData: true });
    }

    return (
        <>
            <Head title="Complete Profile" />

            <div className="mx-auto w-full max-w-lg px-4 py-10">
                <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm transition-all duration-300 dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm">
                    <h1 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">Complete your profile</h1>
                    <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">Please fill out your personal information to continue.</p>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <Label htmlFor="age" className="text-gray-700 dark:text-gray-300">
                                Age
                            </Label>
                            <Input type="number" id="age" value={data.age} onChange={(e) => setData('age', e.target.value)} placeholder="14-100" />
                            {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age}</p>}
                        </div>

                        <div>
                            <Label htmlFor="height" className="text-gray-700 dark:text-gray-300">
                                Height(CM)
                            </Label>
                            <Input
                                type="number"
                                id="height"
                                value={data.height}
                                onChange={(e) => setData('height', e.target.value)}
                                placeholder="100-300"
                            />
                            {errors.height && <p className="mt-1 text-sm text-red-500">{errors.height}</p>}
                        </div>

                        <div>
                            <Label htmlFor="weight" className="text-gray-700 dark:text-gray-300">
                                Weight(KG)
                            </Label>
                            <Input
                                type="number"
                                id="weight"
                                value={data.weight}
                                onChange={(e) => setData('weight', e.target.value)}
                                placeholder="40-700"
                            />
                            {errors.weight && <p className="mt-1 text-sm text-red-500">{errors.weight}</p>}
                        </div>

                        <div>
                            <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                                Phone number
                            </Label>
                            <Input
                                type="number"
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="Area code + phone number 8-15 digits"
                            />
                            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                        </div>

                        <div>
                            <Label htmlFor="personal_code" className="text-gray-700 dark:text-gray-300">
                                Personal code
                            </Label>
                            <Input
                                type="text"
                                id="personal_code"
                                value={data.personal_code}
                                onChange={(e) => setData('personal_code', e.target.value)}
                                placeholder="000000-00000"
                            />
                            {errors.personal_code && <p className="mt-1 text-sm text-red-500">{errors.personal_code}</p>}
                        </div>

                        <div>
                            <Label htmlFor="country" className="text-gray-700 dark:text-gray-300">
                                Country
                            </Label>
                            <Input
                                type="text"
                                id="country"
                                value={data.country}
                                onChange={(e) => setData('country', e.target.value)}
                                placeholder="4-60 characters"
                            />
                            {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
                        </div>

                        <div>
                            <Label htmlFor="city" className="text-gray-700 dark:text-gray-300">
                                City
                            </Label>
                            <Input
                                type="text"
                                id="city"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                placeholder="1-170 characters"
                            />
                            {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                        </div>

                        <div>
                            <Label htmlFor="portrait" className="text-gray-700 dark:text-gray-300">
                                Portrait (optional)
                            </Label>
                            <Input
                                type="file"
                                id="portrait"
                                accept="image/*"
                                onChange={(e) => setData('portrait', e.target.files ? e.target.files[0] : null)}
                            />
                            {errors.portrait && <p className="mt-1 text-sm text-red-500">{errors.portrait}</p>}
                        </div>

                        <div className="pt-2 text-center">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-pink-200/20 px-4 py-2 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                            >
                                {processing ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
