import { useEcho } from '@laravel/echo-react';
import axios from 'axios';
import { useEffect, useState } from 'react';

type ChatMessage = {
    id: number;
    message: string;
    user: { id: number; name: string };
    created_at: string;
};

export default function GroupChat({ groupId }: { groupId: number }) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [text, setText] = useState('');

    useEffect(() => {
        axios.get(`/groups/${groupId}/messages`).then((res) => setMessages(res.data));
    }, [groupId]);

    useEcho<ChatMessage>(`group.${groupId}`, 'GroupMessageSent', (e) => {
        setMessages(prev => {
            if (prev.some(m => m.id === e.id)) return prev;
            return [...prev, e];
        });
    });

    const send = async () => {
        if (!text.trim()) return;

        const res = await axios.post(`/groups/${groupId}/messages`, { message: text });

        setMessages(prev => {
            if (prev.some(m => m.id === res.data.id)) return prev;
            return [...prev, res.data];
        });

        setText('');
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="max-h-64 space-y-2 overflow-y-auto">
                {messages.map((m) => (
                    <div key={m.id} className="text-sm">
                        <strong>{m.user.name}:</strong> {m.message}
                    </div>
                ))}
            </div>

            <input
                className="rounded border px-3 py-2 text-sm"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
            />
        </div>
    );
}
