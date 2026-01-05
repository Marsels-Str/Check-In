import { dashboardModules } from '@/dashboard/registry';
import type { DashboardLayout, DashboardSlot } from '@/dashboard/registry';

type SlotProps = {
    slot: DashboardSlot;
    moduleId: keyof typeof dashboardModules | null;
    setLayout: React.Dispatch<React.SetStateAction<DashboardLayout>>;
    children?: React.ReactNode;
};

type DraggableProps = {
    moduleId: keyof typeof dashboardModules;
    slot: DashboardSlot;
    children: React.ReactNode;
};

export default function DashboardSlot({ slot, setLayout, children }: SlotProps) {
    return (
        <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                const dragged = e.dataTransfer.getData('module');
                const fromSlot = e.dataTransfer.getData('fromSlot');

                if (!dragged || !fromSlot) return;
                if (fromSlot === slot) return;

                setLayout((layout) => {
                    const target = layout[slot];

                    return {
                        ...layout,
                        [slot]: dragged as any,
                        [fromSlot]: target ?? null,
                    };
                });
            }}
        >
            {children}
        </div>
    );
}

export function Draggable({ moduleId, slot, children }: DraggableProps) {
    return (
        <div
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('module', moduleId);
                e.dataTransfer.setData('fromSlot', slot);
            }}
            className="cursor-move"
        >
            {children}
        </div>
    );
}
