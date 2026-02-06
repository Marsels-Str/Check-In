import { User } from '@/types';

export default function UserAvatar({ user }: { user: User }) {
    return typeof user.profile?.portrait === 'string' && user.profile.portrait ? (
        <img
            src={user.profile.portrait}
            alt={user.name}
            className="h-8 w-8"
        />
    ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-300">
            {user.name ? user.name.charAt(0) : '?'}
        </div>
    );
}
