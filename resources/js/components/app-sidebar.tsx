import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, UsersRound, PersonStanding, Phone, Book, Notebook, MapPin, MessagesSquare } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Employees',
        href: '/employees',
        icon: PersonStanding,
    },
    {
        title: 'Groups',
        href: '/groups',
        icon: MessagesSquare,
    },
    {
        title: 'Users',
        href: '/users',
        icon: UsersRound,
    },
    {
        title: 'Roles',
        href: '/roles',
        icon: Notebook,
    },
    {
        title: 'Map',
        href: '/maps',
        icon: MapPin,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'About Us',
        href: '/about-us',
        icon: Book,
    },
    {
        title: 'Contacts',
        href: '/contacts',
        icon: Phone,
    },
];

export function AppSidebar() {
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
