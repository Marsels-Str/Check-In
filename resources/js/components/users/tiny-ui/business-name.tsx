import { useT } from '@/lib/t';

export default function BusinessName({ user }: { user: any }) {
    const t = useT();
    
    const businesses =
        Array.isArray(user.all_businesses) && user.all_businesses.length
            ? user.all_businesses.join(', ')
            : t('users.index.business.none');

    return <span>{businesses}</span>;
}
