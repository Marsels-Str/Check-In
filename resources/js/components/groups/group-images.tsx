import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCan } from '@/lib/can';
import { useT } from '@/lib/t';
import { GroupImage, Image } from '@/types';
import { Form, router } from '@inertiajs/react';

interface Props {
    group: GroupImage;
}

export default function GroupImages({ group }: Props) {
    const canAddImage = useCan('groups.addImage');
    const canRemoveImage = useCan('groups.removeImage');

    const t = useT();

    const imagesDelete = (image: Image) => {
        router.delete(route('groupImages.destroy', image.id));
    };

    return (
        <div>
            {canAddImage && (
                <Form method="post" action={route('groups.images.store', { group: group.id })} className="flex justify-between">
                    {({ errors }) => (
                        <>
                            <Label className="dark:text-white">
                                <span>{t('groups.show.images.label')}:</span>
                                <Input type="file" name="image" accept="image/*" className="rounded-lg bg-background dark:text-white" />
                                <InputError message={errors.image} />
                            </Label>

                            <Button variant="default">{t('groups.show.images.upload')}</Button>
                        </>
                    )}
                </Form>
            )}

            {group.images?.length ? (
                <div className="grid grid-cols-2">
                    {group.images.map((image) => (
                        <div key={image.id} className="relative flex justify-center overflow-hidden rounded-xl">
                            <img src={`data:image/jpeg;base64,${image.image_blob}`} alt="Group image" className="max-h-64" />

                            {canRemoveImage && (
                                <Button variant="link" className="px-0 text-red-700 dark:text-red-500" onClick={() => imagesDelete(image)}>
                                    {t('groups.show.images.delete')}
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground">{t('groups.show.images.empty')}</p>
            )}
        </div>
    );
}
