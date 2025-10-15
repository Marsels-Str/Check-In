import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, router, useForm } from '@inertiajs/react';

export default function CompleteBusiness() {
    const { data, setData, post, errors, processing } = useForm({
        name: '',
        industry: '',
        email: '',
        phone: '',
        country: '',
        city: '',
        street_address: '',
        logo: null as File | null,
        description: '',
    });

    function submit(e: React.SyntheticEvent) {
        e.preventDefault();
        post(route('business.store'), {
            forceFormData: true,
            onError: (errs) => console.log('business errors', errs),
        });
    }

    function cancelSetup() {
        router.post(route('business.cancel'));
    }

    return (
        <>
            <Head title="Create Business" />

            <div className="mx-auto w-full max-w-lg px-4 py-10">
                <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm transition-all duration-300 dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm">
                    <h1 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">Create your business</h1>
                    <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">Fill out your company's details to set up your business profile.</p>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                                Business name
                            </Label>
                            <Input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Company name"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="industry" className="text-gray-700 dark:text-gray-300">
                                Industry
                            </Label>
                            <Input
                                type="text"
                                id="industry"
                                value={data.industry}
                                onChange={(e) => setData('industry', e.target.value)}
                                placeholder="e.g. Construction, IT, Healthcare"
                            />
                            {errors.industry && <p className="mt-1 text-sm text-red-500">{errors.industry}</p>}
                        </div>

                        <div>
                            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                                Business email
                            </Label>
                            <Input
                                type="text"
                                id="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="business@example.com"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
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
                                placeholder="Business phone number"
                            />
                            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
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
                                placeholder="Country"
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
                                placeholder="City"
                            />
                            {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                        </div>

                        <div>
                            <Label htmlFor="street_address" className="text-gray-700 dark:text-gray-300">
                                Street address
                            </Label>
                            <Input
                                type="text"
                                id="street_address"
                                value={data.street_address}
                                onChange={(e) => setData('street_address', e.target.value)}
                                placeholder="Street, building, suite..."
                            />
                            {errors.street_address && <p className="mt-1 text-sm text-red-500">{errors.street_address}</p>}
                        </div>

                        <div>
                            <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                                Description
                            </Label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Brief description of your business"
                                className="block w-full rounded-md border border-gray-300 bg-white/80 px-3 py-2 text-sm text-gray-900 shadow-sm transition-all placeholder:text-gray-400 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-white/10 dark:bg-[#0f0f0f]/70 dark:text-gray-100 dark:placeholder:text-gray-500"
                                rows={3}
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                        </div>

                        <div>
                            <Label htmlFor="logo" className="text-gray-700 dark:text-gray-300">
                                Logo (optional)
                            </Label>
                            <Input
                                type="file"
                                id="logo"
                                accept="image/*"
                                onChange={(e) => setData('logo', e.target.files ? e.target.files[0] : null)}
                            />
                            {errors.logo && <p className="mt-1 text-sm text-red-500">{errors.logo}</p>}
                        </div>

                        <div className="flex justify-center gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-pink-200/20 px-4 py-2 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                            >
                                {processing ? 'Saving...' : 'Save'}
                            </Button>

                            <Button
                                type="button"
                                onClick={cancelSetup}
                                className="rounded-lg bg-gray-200/60 px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-300/50 transition-all duration-300 hover:bg-gray-300/60 hover:text-gray-900 dark:bg-gray-800/60 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700/60 dark:hover:text-white"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
