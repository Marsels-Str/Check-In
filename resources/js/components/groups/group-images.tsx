import { router } from '@inertiajs/react';

export default function GroupImages({ group, errors }: any) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this image?')) {
            router.delete(route('groupImages.destroy', id));
        }
    };

    const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        router.post(route('job-groups.images.store', { jobGroup: group.id }), formData, {
            forceFormData: true,
        });
    };

    return (
        <div className="mt-8">
            <form onSubmit={handleUpload} className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <label className="flex flex-col text-sm font-medium text-gray-700 dark:text-gray-300">
                    <span className="mb-1">Upload new image:</span>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        className="block w-full rounded-lg bg-transparent p-2 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:text-gray-100"
                    />
                </label>

                <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
                >
                    Upload
                </button>
            </form>

            {errors.image && <p className="mb-3 text-sm text-red-500">{errors.image}</p>}

            {group.images?.length ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {group.images.map((img: any) => (
                        <div key={img.id} className="relative flex items-center justify-center overflow-hidden rounded-xl transition hover:shadow-lg">
                            <img src={`data:image/jpeg;base64,${img.image_blob}`} alt="Group image" className="max-h-64 w-full object-contain" />

                            <button
                                onClick={() => handleDelete(img.id)}
                                className="absolute top-2 right-2 rounded-md bg-red-600/90 px-2 py-1 text-sm text-white opacity-90 transition hover:bg-red-700 hover:opacity-100"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 dark:text-gray-400">No images uploaded yet.</p>
            )}
        </div>
    );
}
