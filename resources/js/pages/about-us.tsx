import Accordion from '@/components/ui/accordion';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function AboutUs() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'About us',
            href: '/about-us',
        },
    ];

    const sections = [
        {
            title: 'Why Choose Us?',
            content: 'Because we are trying to be the best at what we do and we keeps progressing towards the future.',
        },
        {
            title: 'What is our mission?',
            content:
                'Our mission is to provide small and even large bussineses with the best worker management application you can find on the internet that is totally for free.',
        },
        {
            title: 'What do we value?',
            content:
                'We value the time user spends using our application and we always look forward to improve the user experience, thats why we need your precious feedbcacks!',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="About us" />
            <h1 className="flex justify-center text-3xl leading-tight font-bold md:text-5xl">About Us</h1>

            <div className="mx-auto">
                <Accordion items={sections} defaultOpenIndex={null} />
            </div>

            <p>sigma</p>

        </AppLayout>
    );
}
