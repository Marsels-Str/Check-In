import { usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';

export function useCan(permission: string): boolean {
  const { auth } = usePage<PageProps>().props;
  return auth.permissions.includes(permission);
}
