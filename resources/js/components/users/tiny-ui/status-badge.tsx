export default function StatusBadge({ active }: { active: boolean }) {
    return active ? (
        <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 ring-1 ring-yellow-400/30 ring-inset dark:bg-yellow-900/30 dark:text-yellow-400 dark:ring-yellow-500/20">
            Active
        </span>
    ) : (
        <span className="inline-flex items-center rounded-md bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-700 ring-1 ring-pink-400/30 ring-inset dark:bg-pink-800/40 dark:text-pink-400 dark:ring-pink-500/20">
            Inactive
        </span>
    );
}
