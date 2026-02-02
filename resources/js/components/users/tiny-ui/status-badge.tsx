import { useT } from '@/lib/t';
import { User } from '@/types';

interface Props {
    active: boolean;
    viewer?: User;
    target?: User;
}

export default function StatusBadge({ active, viewer, target }: Props) {
    const t = useT();

    const viewerRoles = viewer?.roles?.map((r) => r.name) ?? [];
    const targetRoles = target?.roles?.map((r) => r.name) ?? [];

    const viewerIsOwner = viewerRoles.includes('Owner');
    const viewerIsBusiness = viewerRoles.includes('Business');
    const targetIsBusiness = targetRoles.includes('Business');

    const canView = viewerIsOwner || viewerIsBusiness;
    if (!canView) return null;

    if (viewerIsBusiness && targetIsBusiness) return null;

    if (viewerIsOwner && targetIsBusiness) {
        return (
            <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-400/30 ring-inset dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-500/20">
                {t('users.index.status.business')}
            </span>
        );
    }

    return active ? (
        <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 ring-1 ring-yellow-400/30 ring-inset dark:bg-yellow-900/30 dark:text-yellow-400 dark:ring-yellow-500/20">
            {t('users.index.status.active')}
        </span>
    ) : (
        <span className="inline-flex items-center rounded-md bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-700 ring-1 ring-pink-400/30 ring-inset dark:bg-pink-800/40 dark:text-pink-400 dark:ring-pink-500/20">
            {t('users.index.status.inactive')}
        </span>
    );
}
