import { useT } from '@/lib/t';
import AppLogo from './app-logo';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { NavFooter } from '@/components/nav-footer';
import { LayoutGrid, UsersRound, PersonStanding, Phone, Book, Notebook, MapPin, MessagesSquare, Languages } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

export function AppSidebar() {
    const t = useT();
    
    const mainNavItems: NavItem[] = [
        {
            title: t('sidebar.dashboard'),
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: t('sidebar.employees'),
            href: '/employees',
            icon: PersonStanding,
        },
        {
            title: t('sidebar.groups'),
            href: '/groups',
            icon: MessagesSquare,
        },
        {
            title: t('sidebar.users'),
            href: '/users',
            icon: UsersRound,
        },
        {
            title: t('sidebar.roles'),
            href: '/roles',
            icon: Notebook,
        },
        {
            title: t('sidebar.map'),
            href: '/maps',
            icon: MapPin,
        },
        {
            title: t('sidebar.languages'),
            href: '/languages',
            icon: Languages,
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: t('sidebar.about'),
            href: '/about-us',
            icon: Book,
        },
        {
            title: t('sidebar.contacts'),
            href: '/contacts',
            icon: Phone,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
