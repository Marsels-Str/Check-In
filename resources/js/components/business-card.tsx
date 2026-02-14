import { useT } from '@/lib/t';
import { useRef } from 'react';
import { BusinessProfile } from '@/types';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Props {
    business: BusinessProfile;
}

export default function BusinessCard({ business }: Props) {
    const t = useT();

    if (!business) {
        return (
            <Card className="mx-auto w-full max-w-sm rounded-xl shadow-lg">
                <CardContent className="flex flex-col space-y-2 p-4 text-center text-muted-foreground">
                    <p>{t('settings.business.empty')}</p>
                    <p>{t('settings.business.empty.text')}</p>
                </CardContent>
            </Card>
        );
    }

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const formData = new FormData();
        formData.append('logo', e.target.files[0]);

        router.post(route('business.updateLogo'), formData, {
            forceFormData: true,
            preserveScroll: true,
            onError: (errors) => console.error(errors),
        });
    };

    const handleRemoveLogo = () => {
        if (confirm(t('settings.business.remove'))) {
            router.delete(route('business.removeLogo'), {
                preserveScroll: true,
            });
        }
    };

    return (
        <Card className="mx-auto w-full max-w-sm rounded-xl">
            <CardContent className="flex flex-col items-center p-6">
                <div className="cursor-pointer" onClick={handleAvatarClick}>
                    <Avatar className="h-24 w-24 rounded-full border">
                        <AvatarImage src={typeof business.logo === 'string' ? business.logo : undefined} alt={business.name} />
                        <AvatarFallback>{business.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>

                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                {business.logo && (
                    <Button variant="destructive" onClick={handleRemoveLogo}>
                        {t('settings.business.remove.confirm')}
                    </Button>
                )}

                <div className="text-center">
                    <h2 className="text-lg font-bold">{business.name}</h2>
                    <p className="text-muted-foreground">{business.email}</p>
                </div>

                <div className="w-full border-t">
                    {business.phone && (
                        <p>
                            <span className="font-bold">{t('settings.business.phone')}:</span> {business.phone}
                        </p>
                    )}
                    <p>
                        <span className="font-bold">{t('settings.business.adress')}:</span> {business.address || '—'}
                    </p>
                    <p>
                        <span className="font-bold">{t('settings.business.city')}:</span> {business.city || '—'}
                    </p>
                    <p>
                        <span className="font-bold">{t('settings.business.country')}:</span> {business.country || '—'}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
