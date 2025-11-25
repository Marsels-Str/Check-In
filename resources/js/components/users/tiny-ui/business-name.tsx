import { User } from '@/types';

export default function BusinessName({ user }: { user: User }) {
    const businesses =
        Array.isArray((user as any).businesses) && (user as any).businesses.length
            ? (user as any).businesses.map((b: any) => b.name).join(', ')
            : 'No business';

    return <span>{businesses}</span>;
}
