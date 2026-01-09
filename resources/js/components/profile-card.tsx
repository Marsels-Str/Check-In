import { useRef } from 'react';
import { type User } from '@/types';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useInitials } from '@/hooks/use-initials';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfileCard({ user }: { user: User }) {
    const getInitials = useInitials();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const formData = new FormData();
        formData.append('portrait', e.target.files[0]);

        router.post(route('profile.portrait.update'), formData, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <Card className="mx-auto w-full max-w-sm rounded-xl shadow-lg">
            <CardContent className="flex flex-col items-center space-y-4 p-6">
                <div className="cursor-pointer" onClick={handleAvatarClick}>
                    <Avatar className="h-24 w-24 rounded-full border">
                        <AvatarImage src={typeof user.profile?.portrait === 'string' ? user.profile.portrait : undefined} alt={user.name} />
                        <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                </div>

                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                {user.profile?.portrait && (
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                            if (confirm('Are you sure you want to remove your portrait?')) {
                                router.delete(route('profile.portrait.remove'), {
                                    preserveScroll: true,
                                });
                            }
                        }}
                    >
                        Remove
                    </Button>
                )}

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
