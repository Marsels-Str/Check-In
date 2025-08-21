import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function JobGroup() {
    return (
        <AppLayout>
            <Head title="Group" />
            <h1 className="text-3xl font-bold leading-tight md:text-5xl">Group</h1>
            <p className="max-w-3xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                Under construction. This is a sample job group page. You can edit this page by going to the
                <code className="text-sm font-mono rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-700">
                    resources/js/pages/job-group.tsx
                </code>{' '}file.
            </p>
        </AppLayout>
    );
}
