import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { useRef, useState } from 'react';

interface Business {
    id: number;
    name: string;
    email: string;
    phone?: string;
    logo?: string | null;
    country?: string;
    city?: string;
    street_address?: string;
    owner?: {
        name: string;
    };
}

export default function BusinessCard({ business }: { business?: Business | null }) {
    if (!business) {
        return (
            <Card className="mx-auto w-full max-w-sm rounded-xl shadow-lg">
                <CardContent className="flex flex-col items-center space-y-4 p-6 text-center text-gray-500">
                    <p>No business profile found.</p>
                    <p className="text-sm">Create one to view details here.</p>
                </CardContent>
            </Card>
        );
    }

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('logo', file);

            setProcessing(true);
            router.post(route('business.updateLogo'), formData, {
                forceFormData: true,
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            });
        }
    };

    const handleRemoveLogo = () => {
        if (confirm('Remove business logo?')) {
            router.delete(route('business.removeLogo'), {
                preserveScroll: true,
            });
        }
    };

    const logoSrc = preview || business.logo || undefined;

    return (
        <Card className="mx-auto w-full max-w-sm rounded-xl shadow-lg">
            <CardContent className="flex flex-col items-center space-y-4 p-6">
                <div className="cursor-pointer" onClick={handleAvatarClick}>
                    <Avatar className="h-24 w-24 rounded-full border">
                        <AvatarImage src={logoSrc} alt={business.name} />
                        <AvatarFallback className="text-xl">{business.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>

                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                {(business.logo || preview) && (
                    <Button type="button" variant="destructive" className="mt-2" onClick={handleRemoveLogo} disabled={processing}>
                        Remove Logo
                    </Button>
                )}

                <div className="space-y-1 text-center">
                    <h2 className="text-lg font-semibold">{business.name}</h2>
                    <p className="text-sm text-muted-foreground">{business.email}</p>
                    {business.owner && (
                        <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Owner:</span> {business.owner.name}
                        </p>
                    )}
                </div>

                <div className="w-full space-y-1 border-t pt-4 text-sm">
                    {business.phone && (
                        <p>
                            <span className="font-medium">Phone: </span>
                            {business.phone}
                        </p>
                    )}
                    <p>
                        <span className="font-medium">Address:</span> {business.street_address || '—'}
                    </p>
                    <p>
                        <span className="font-medium">City:</span> {business.city || '—'}
                    </p>
                    <p>
                        <span className="font-medium">Country:</span> {business.country || '—'}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
