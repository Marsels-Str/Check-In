import type { Config } from 'ziggy-js';
import { LucideIcon } from 'lucide-react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

export interface Auth {
    user: User;
    permissions: string[];
}

export interface PageProps extends InertiaPageProps {
  auth: Auth;
}

export interface BreadcrumbItem {
    href: string;
    title: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    href: string;
    title: string;
    isActive?: boolean;
    icon?: LucideIcon | null;
}

export interface TimeLog {
    id: number;
    clock_in: string;
    clock_out: string | null;
}

export interface EmptyState {
    empty?: 'nothing-to-show';
}

export interface DiagramState<T> extends EmptyState {
    data: T[];
    range: 'week' | 'month';
}

export interface WorkedHoursPoint {
    label: string;
    hours: number;
}

export interface EmployeeActivityPoint {
    label: string;
    count: number;
}

export interface OverviewUser {
    id: number;
    name: string;
    profile?: {
        portrait?: string | null;
    };
    is_clocked_in: boolean;
    offline_for?: string | null;
}

export interface OverviewSelf {
    id: number;
    name: string;
    profile?: {
        portrait?: string | null;
    };
    is_clocked_in: boolean;
    time_logs: TimeLog[];
}

export interface OverviewData extends EmptyState {
    users?: OverviewUser[];
    self?: OverviewSelf;
}

export interface MessageReminder {
    group_id: number;
    group_name: string;
    unread_count: number;
    has_unread: boolean;
    first_unread_at?: string | null;
};

export interface MessageReminderState extends EmptyState {
    data: MessageReminder[];
}

export interface SharedData {
    name: string;
    auth: {
        user: User;
        permissions: string[];
    };
    sidebarOpen: boolean;
    [key: string]: unknown;
    quote: { message: string; author: string };
    ziggy: Config & { location: string };
}

export interface UserProfile {
    user_id?: number;
    age?: number | string;
    city?: string;
    phone?: string;
    height?: number | string;
    weight?: number | string;
    country?: string;
    unique_id?: string;
    personal_code?: string;
    portrait?: string | File | null;
}

export interface BusinessProfile {
    id: number;
    maps?: Map[];
    name?: string;
    city?: string;
    email?: string;
    phone?: string;
    country?: string;
    industry?: string;
    employees?: number;
    created_at?: string;
    updated_at?: string;
    logo?: string | null;
    description?: string;
    groups?: Group[];
    street_address?: string;
}

export interface Map {
  id: number;
  name?: string;
  type?: string;
  polygon?: any;
  created_at: string;
  updated_at: string;
  lat?: number | null;
  lng?: number | null;
  business_id: number;
  radius?: number | null;
}

export interface EditableMap {
  name?: string;
  type?: string;
  lat?: number | string | null;
  lng?: number | string | null;
  radius?: number | string | null;
  polygon?: any;
}

export interface User {
    id: number;
    name: string;
    email: string;
    roles: string[];
    password: string;
    unique_id: string;
    created_at: string;
    updated_at: string;
    time_logs?: TimeLog[];
    profile?: UserProfile | null;
    email_verified_at: string | null;
    business?: BusinessProfile | null;
    [key: string]: unknown; // This allows for additional properties...
}
