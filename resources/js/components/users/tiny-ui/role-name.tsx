import { User } from '@/types';

export default function RoleName({ user }: { user: User }) {
    const roles =
        Array.isArray((user as any).roles) && (user as any).roles.length
            ? (user as any).roles.map((r: any) => r.name).join(', ')
            : '';

    return <span>{roles}</span>;
}
