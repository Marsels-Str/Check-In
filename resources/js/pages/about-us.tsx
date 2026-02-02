import { useT } from '@/lib/t';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import Accordion from '@/components/ui/accordion';

export default function AboutUs() {
    const t = useT();
    
    const breadcrumbs: BreadcrumbItem[] = [
        { 
            title: t('breadcrumb.about'),
            href: '/about-us'
        }
    ];

    const sections = [
        {
            title: t('about.why'),
            content: t('about.why.text'),
        },
        {
            title: t('about.mission'),
            content:
                t('about.mission.text'),
        },
        {
            title: t('about.value'),
            content:
                t('about.value.text'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="About us" />
            <meta name="description" content="Learn more about us, our mission, and our values" />
            
            <h1 className="flex justify-center text-3xl leading-tight font-bold md:text-5xl">About us</h1>

            <div className="mx-auto">
                <Accordion items={sections} defaultOpenIndex={null} />
            </div>

        </AppLayout>
    );
}
