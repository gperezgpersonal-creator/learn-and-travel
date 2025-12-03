import { useTranslations } from 'next-intl';
import { clientMessages } from '@/lib/client-data';

export default function ClientMessagesPage() {
    const t = useTranslations('ClientMessages');

    return (
        <main>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">{t('title')}</h1>
                <button className="btn btn-primary text-sm">{t('compose')}</button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                    {clientMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`p-6 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors ${!msg.read ? 'bg-blue-50/50' : ''}`}
                        >
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${!msg.read ? 'bg-primary' : 'bg-transparent'}`}></div>
                            <div className="flex-grow min-w-0">
                                <div className="flex justify-between mb-1">
                                    <span className={`font-medium text-sm ${!msg.read ? 'text-slate-900' : 'text-slate-600'}`}>{msg.sender}</span>
                                    <span className="text-xs text-slate-400">{msg.date}</span>
                                </div>
                                <h4 className={`text-sm mb-1 truncate ${!msg.read ? 'font-bold text-slate-900' : 'text-slate-700'}`}>{msg.subject}</h4>
                                <p className="text-xs text-slate-500 truncate">{msg.preview}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
