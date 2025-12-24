export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white border-b border-slate-200 py-4 px-6 flex justify-center sticky top-0 z-10">
                <div className="font-serif font-bold text-xl text-slate-800 tracking-tight">
                    Learn & Travel
                </div>
            </header>
            <main className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-8">
                {children}
            </main>
            <footer className="py-6 text-center text-slate-400 text-sm">
                &copy; {new Date().getFullYear()} Learn & Travel. All rights reserved.
            </footer>
        </div>
    );
}
