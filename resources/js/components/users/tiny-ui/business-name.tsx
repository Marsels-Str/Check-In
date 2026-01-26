import { useT } from '@/lib/t';
import { User } from '@/types';

export default function BusinessName({ user }: { user: User }) {
    const t = useT();
    
    const businesses =
        Array.isArray(user.all_businesses) && user.all_businesses.length
            ? user.all_businesses.join(', ')
            : t('users.index.business.none');

    return <span>{businesses}</span>;
}
