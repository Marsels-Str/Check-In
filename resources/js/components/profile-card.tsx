import { useT } from '@/lib/t';
import { useRef } from 'react';
import { User } from '@/types';
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

    const t = useT();

    return (
        <Card className="mx-auto w-full max-w-sm rounded-xl">
            <CardContent className="flex flex-col items-center space-y-2 p-6">
                <div className="cursor-pointer" onClick={handleAvatarClick}>
                    <Avatar className="h-24 w-24 rounded-full border">
                        <AvatarImage src={typeof user.profile?.portrait === 'string' ? user.profile.portrait : undefined} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                </div>

                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                {user.profile?.portrait && (
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                            if (confirm(t('settings.profile.remove.confirm'))) {
                                router.delete(route('profile.portrait.remove'), {
                                    preserveScroll: true,
                                });
                            }
                        }}
                    >
                        {t('settings.profile.remove')}
                    </Button>
                )}

                <div className="text-center">
                    <h2 className="text-lg font-bold">{user.name}</h2>
                    <p className="text-muted-foreground">{t('settings.profile.id')}: {user.profile?.unique_id}</p>
                </div>

                <div className="w-full border-t">
                    <p>
                        <span className="font-bold">{t('settings.profile.age')}:</span> {user.profile?.age ?? '—'}
                    </p>
                    <p>
                        <span className="font-bold">{t('settings.profile.code')}:</span> {user.profile?.personal_code ?? '—'}
                    </p>
                    <p>
                        <span className="font-bold">{t('settings.profile.phone')}:</span> {user.profile?.phone ?? '—'}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
