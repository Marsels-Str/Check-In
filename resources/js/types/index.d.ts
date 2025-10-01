import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
    permissions: string[];
}

export interface PageProps extends InertiaPageProps {
  auth: Auth;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: {
        user: User;
        permissions: string[];
    };
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface UserProfile {
    age?: number;
    height?: number;
    weight?: number;
    phone?: string;
    country?: string;
    city?: string;
    personal_code?: string;
    portrait?: string | null;
    unique_id?: string;
}

export interface BusinessProfile {
    id?: number;
    name?: string;
    industry?: string;
    email?: string;
    phone?: string;
    country?: string;
    city?: string;
    street_address?: string;
    logo?: string | null;
    description?: string;
    employees?: number;
    created_at?: string;
    updated_at?: string;

    jobGroups?: JobGroup[];
    maps?: Map[];
}

export interface Map {
    id: number;
    name?: string;
    lat?: number;
    lng?: number;
    radius?: number;
    polygon?: any;
    type?: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    unique_id: string;
    name: string;
    email: string;
    profile?: UserProfile | null;
    business?: BusinessProfile | null;
    roles: string[];
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
