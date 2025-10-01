import { Head, router } from '@inertiajs/react';

export default function AfterComplete() {
    function goToBusiness() {
        router.get(route('business.complete'));
    }

    function skipBusiness() {
        router.get(route('dashboard'));
    }

    return (
        <>
            <Head title="Next Step" />
            <div className="flex h-screen flex-col items-center justify-center">
                <div className="space-y-4 rounded-md border p-6 text-center shadow-md">
                    <h2 className="text-lg font-semibold">Do you own a business?</h2>
                    <p className="text-gray-600">If yes, you can complete your business profile now.</p>
                    <div className="flex justify-center gap-4">
                        <button onClick={goToBusiness} className="rounded-md bg-blue-600 px-4 py-2 text-white">
                            Yes
                        </button>
                        <button onClick={skipBusiness} className="rounded-md bg-gray-300 px-4 py-2">
                            No
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
