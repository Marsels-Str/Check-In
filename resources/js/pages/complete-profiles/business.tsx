import { Head, useForm } from '@inertiajs/react';

export default function CompleteBusiness() {
    const { data, setData, post, errors } = useForm({
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
        post(route('business.complete.store'), {
            forceFormData: true,
            onError: (errs) => console.log('business errors', errs),
        });
    }

    return (
        <>
            <Head title="Business Create" />
            <div>
                <form onSubmit={submit} className="mx-auto w-full max-w-md space-y-6 rounded-md border border-gray-300 px-4 py-5 shadow-sm sm:p-6">
                    <div className="space-y-3 text-gray-400">
                        <label htmlFor="name">Business Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Company name"
                            className="block w-full rounded-md border focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        {errors.name && <div className="text-sm text-red-500">{errors.name}</div>}

                        <label htmlFor="industry">Industry</label>
                        <input
                            type="text"
                            id="industry"
                            name="industry"
                            value={data.industry}
                            onChange={(e) => setData('industry', e.target.value)}
                            placeholder="e.g. Construction, IT, Healthcare"
                            className="block w-full rounded-md border focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        {errors.industry && <div className="text-sm text-red-500">{errors.industry}</div>}

                        <label htmlFor="email">Business Email</label>
                        <input
                            id="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="business@example.com"
                            className="block w-full rounded-md border focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        {errors.email && <div className="text-sm text-red-500">{errors.email}</div>}

                        <label htmlFor="phone">Phone</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="Business phone number"
                            className="block w-full rounded-md border focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        {errors.phone && <div className="text-sm text-red-500">{errors.phone}</div>}

                        <label htmlFor="country">Country</label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={data.country}
                            onChange={(e) => setData('country', e.target.value)}
                            placeholder="Country"
                            className="block w-full rounded-md border focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        {errors.country && <div className="text-sm text-red-500">{errors.country}</div>}

                        <label htmlFor="city">City</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={data.city}
                            onChange={(e) => setData('city', e.target.value)}
                            placeholder="City"
                            className="block w-full rounded-md border focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        {errors.city && <div className="text-sm text-red-500">{errors.city}</div>}

                        <label htmlFor="street_address">Street Address</label>
                        <input
                            type="text"
                            id="street_address"
                            name="street_address"
                            value={data.street_address}
                            onChange={(e) => setData('street_address', e.target.value)}
                            placeholder="Street, building, suite..."
                            className="block w-full rounded-md border focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        {errors.street_address && <div className="text-sm text-red-500">{errors.street_address}</div>}

                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Brief description of your business"
                            className="block w-full rounded-md border focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        {errors.description && <div className="text-sm text-red-500">{errors.description}</div>}

                        <label htmlFor="logo">Logo (optional)</label>
                        <input
                            type="file"
                            id="logo"
                            name="logo"
                            accept="image/*"
                            onChange={(e) => setData('logo', e.target.files ? e.target.files[0] : null)}
                            className="block w-full cursor-pointer rounded-md border text-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.logo && <div className="text-sm text-red-500">{errors.logo}</div>}
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
        </>
    );
}
