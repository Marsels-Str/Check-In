import { Head, useForm } from '@inertiajs/react';

export default function CompletProfile() {
    const { data, setData, post, errors } = useForm({
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
        post(route('profile.complete.store'), {
            forceFormData: true,
            onError: (errs) => console.error(errs),
        });
    }

    return (
        <>
            <Head title="User Create" />
            <div>
                <form onSubmit={submit} className="mx-auto w-full max-w-md space-y-6 rounded-md border border-gray-300 px-4 py-5 shadow-sm sm:p-6">
                    <div className="space-y-3 text-gray-400">
                        <label htmlFor="age">Age</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            min="1"
                            value={data.age}
                            onChange={(e) => setData('age', e.target.value)}
                            placeholder="Age"
                            className="block w-full rounded-md border focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        {errors.age && <div className="text-sm text-red-500">{errors.age}</div>}

                        <label htmlFor="height">Height</label>
                        <input
                            type="text"
                            id="height"
                            name="height"
                            min="1"
                            value={data.height}
                            onChange={(e) => setData('height', e.target.value)}
                            placeholder="Height in CM"
                            className="block w-full rounded-md border focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        {errors.height && <div className="text-sm text-red-500">{errors.height}</div>}

                        <label htmlFor="weight" className="block text-sm font-medium">
                            Weight
                        </label>
                        <input
                            type="text"
                            id="weight"
                            name="weight"
                            min="1"
                            value={data.weight}
                            onChange={(e) => setData('weight', e.target.value)}
                            placeholder="Weight in KG"
                            className="block w-full rounded-md border focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        {errors.weight && <div className="text-sm text-red-500">{errors.weight}</div>}

                        <label htmlFor="phone">Phone number</label>
                        <input
                            type="number"
                            id="phone"
                            name="phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="Phone Number"
                            className="block w-full rounded-md border focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        {errors.phone && <div className="text-sm text-red-500">{errors.phone}</div>}

                        <label htmlFor="personal_code">Personal Code</label>
                        <input
                            type="text"
                            id="personal_code"
                            name="personal_code"
                            min="1"
                            value={data.personal_code}
                            onChange={(e) => setData('personal_code', e.target.value)}
                            placeholder="Personal Code (000000-00000)"
                            className="block w-full rounded-md border focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        {errors.personal_code && <div className="text-sm text-red-500">{errors.personal_code}</div>}

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

                        <label htmlFor="portrait">Portrait is optional for now</label>
                        <input
                            type="file"
                            id="portrait"
                            name="portrait"
                            accept="image/*"
                            onChange={(e) => setData('portrait', e.target.files ? e.target.files[0] : null)}
                            className="block w-full cursor-pointer rounded-md border text-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.portrait && <div className="text-sm text-red-500">{errors.portrait}</div>}
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
