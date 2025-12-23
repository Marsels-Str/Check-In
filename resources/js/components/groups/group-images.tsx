import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCan } from '@/lib/can';
import { Button } from '@headlessui/react';
import { Form, router } from '@inertiajs/react';

export default function GroupImages({ group }: any) {
    const canAddImage = useCan('groups.addImage');
    const canRemoveImage = useCan('groups.removeImage');

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this image?')) {
            router.delete(route('groupImages.destroy', id));
        }
    };

    return (
        <div className="mt-8">
            {canAddImage && (
                <Form
                    method="post"
                    action={route('groups.images.store', { group: group.id })}
                    className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center"
                >
                    {({ errors }) => (
                        <>
                            <Label className="flex flex-col text-sm font-medium text-gray-700 dark:text-gray-300">
                                <span className="mb-1">Upload new image:</span>
                                <Input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    className="block w-full rounded-lg bg-transparent p-2 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:text-gray-100"
                                />
                                <InputError message={errors.image} />
                            </Label>

                            <Button
                                type="submit"
                                className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                            >
                                Upload
                            </Button>
                        </>
                    )}
                </Form>
            )}

            {group.images?.length ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {group.images.map((img: any) => (
                        <div key={img.id} className="relative flex items-center justify-center overflow-hidden rounded-xl transition hover:shadow-lg">
                            <img src={`data:image/jpeg;base64,${img.image_blob}`} alt="Group image" className="max-h-64 w-full object-contain" />

                            {canRemoveImage && (
                                <Button
                                    onClick={() => handleDelete(img.id)}
                                    className="absolute top-2 right-2 rounded-md bg-red-600/90 px-2 py-1 text-sm text-white opacity-90 transition hover:bg-red-700 hover:opacity-100"
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 dark:text-gray-400">No images uploaded yet.</p>
            )}
        </div>
    );
}
