import { useTranslations } from 'next-intl';
import { blogPosts } from '@/lib/blog';
import { programs } from '@/lib/programs';

export default function StaffCMSPage() {
    const t = useTranslations('StaffCMS');

    return (
        <main>
            <h1 className="text-2xl font-bold text-slate-800 mb-8">{t('title')}</h1>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Programs List */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="font-bold text-slate-700">{t('programs')}</h2>
                        <button className="text-primary text-sm font-medium hover:underline">{t('addNew')}</button>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {programs.map((program) => (
                            <div key={program.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="font-medium text-slate-900">{program.title}</div>
                                <div className="flex gap-3">
                                    <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${program.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {program.status}
                                    </span>
                                    <button className="text-slate-400 hover:text-primary">✏️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Blog Posts List */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="font-bold text-slate-700">{t('blogPosts')}</h2>
                        <button className="text-primary text-sm font-medium hover:underline">{t('addNew')}</button>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {blogPosts.map((post) => (
                            <div key={post.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="font-medium text-slate-900 truncate max-w-[200px]">{post.title}</div>
                                <div className="flex gap-3 items-center">
                                    <span className="text-xs text-slate-500">{post.date}</span>
                                    <button className="text-slate-400 hover:text-primary">✏️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
