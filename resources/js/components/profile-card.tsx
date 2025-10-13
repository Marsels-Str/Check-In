import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function ProfileCard({ user }: { user: User }) {
    const getInitials = useInitials();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const { setData, processing } = useForm({
        portrait: null as File | null,
    });

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('portrait', file);

            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <Card className="mx-auto w-full max-w-sm rounded-xl shadow-lg">
            <CardContent className="flex flex-col items-center space-y-4 p-6">
                <div className="cursor-pointer" onClick={handleAvatarClick}>
                    <Avatar className="h-24 w-24 rounded-full border">
                        <AvatarImage
                            src={preview || (typeof user.profile?.portrait === 'string' ? user.profile.portrait : undefined)}
                            alt={user.name}
                        />
                        <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        router.post(route('profile.portrait.update'), formData, {
                            forceFormData: true,
                            onSuccess: () => setPreview(null),
                            onError: (errors) => console.error(errors),
                        });
                    }}
                >
                    <input type="file" name="portrait" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                    {preview && (
                        <div className="mt-2 flex gap-2">
                            <Button type="submit" disabled={processing}>
                                Save
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => setPreview(null)}>
                                Cancel
                            </Button>
                        </div>
                    )}

                    {(user.profile?.portrait || preview) && (
                        <Button
                            type="button"
                            variant="destructive"
                            className="mt-2"
                            onClick={() => {
                                if (confirm('Are you sure you want to remove your portrait?')) {
                                    router.delete(route('profile.portrait.remove'), {
                                        preserveScroll: true,
                                    });
                                }
                            }}
                        >
                            Remove Portrait
                        </Button>
                    )}
                </form>

                <div className="space-y-1 text-center">
                    <h2 className="text-lg font-semibold">{user.name}</h2>
                    <p className="text-sm text-muted-foreground">ID: {user.profile?.unique_id}</p>
                </div>

                <div className="w-full space-y-1 border-t pt-4 text-sm">
                    <p>
                        <span className="font-medium">Age:</span> {user.profile?.age ?? '—'}
                    </p>
                    <p>
                        <span className="font-medium">Personal code:</span> {user.profile?.personal_code ?? '—'}
                    </p>
                    <p>
                        <span className="font-medium">Phone:</span> {user.profile?.phone ?? '—'}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
