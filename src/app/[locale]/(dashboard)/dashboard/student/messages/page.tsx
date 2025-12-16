'use client';

import { useEffect, useState, useRef } from 'react';
import { studentService } from '@/services/mock/studentService';
import { Message } from '@/services/mock/mockData';
import FadeIn from '@/components/ui/FadeIn';
import { Send, Phone, AlertTriangle, MessageSquare } from 'lucide-react';

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadData = async () => {
            // Fetch messages for exemplary student or problematic
            const msgs = await studentService.getMessages('student-exemplary');
            setMessages(msgs);
            setLoading(false);
        };
        loadData();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msgText = newMessage;
        setNewMessage('');

        // Optimistic update
        const tempMsg: Message = {
            id: `temp-${Date.now()}`,
            userId: 'student-exemplary',
            sender: 'user',
            text: msgText,
            timestamp: new Date().toISOString(),
            read: true
        };
        setMessages(prev => [...prev, tempMsg]);

        await studentService.sendMessage('student-exemplary', msgText);
    };

    if (loading) return <div className="p-8">Loading messages...</div>;

    return (
        <div className="space-y-8 h-[calc(100vh-140px)] flex flex-col">
            <FadeIn>
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Messages</h1>
                        <p className="text-slate-500">Direct line to Learn & Travel staff.</p>
                    </div>
                    {/* Panic Button */}
                    <button className="btn bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 animate-pulse shadow-lg shadow-red-200">
                        <AlertTriangle className="w-5 h-5" />
                        <span>Emergency Help</span>
                    </button>
                </div>
            </FadeIn>

            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                {/* Chat Area */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                            <p>No messages yet. Start a conversation!</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] p-4 rounded-2xl ${msg.sender === 'user'
                                        ? 'bg-primary text-white rounded-tr-none'
                                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                                    }`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-slate-400'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-3 rounded-lg border border-slate-200 focus:border-primary outline-none bg-slate-50 focus:bg-white transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="btn btn-primary px-6 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
