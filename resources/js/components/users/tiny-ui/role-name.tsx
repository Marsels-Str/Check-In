import { User } from '@/types';

export default function RoleName({ user }: { user: User }) {
    const roles =
        Array.isArray((user).roles) && (user).roles.length
            ? (user).roles.map((r) => r.name).join(', ')
            : '';

    return <span>{roles}</span>;
}
