import axios from 'axios';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useEcho } from '@laravel/echo-react';

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
        setMessages((prev) => {
            if (prev.some((m) => m.id === e.id)) return prev;
            return [...prev, e];
        });
    });

    const send = async () => {
        if (!text.trim()) return;

        const res = await axios.post(`/groups/${groupId}/messages`, { message: text });

        setMessages((prev) => {
            if (prev.some((m) => m.id === res.data.id)) return prev;
            return [...prev, res.data];
        });

        setText('');
    };

    return (
        <div className="flex flex-col">
            <div className="max-h-64 overflow-y-auto">
                {messages.map((m) => (
                    <div key={m.id}>
                        <strong>{m.user.name}:</strong> {m.message}
                    </div>
                ))}
            </div>

            <Input
                className="rounded-xl border"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
            />
        </div>
    );
}



// PASKATĪTIEs MOBILE VIEW VISAM, KAS SAISTĪTS AR GRUPĀM!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!