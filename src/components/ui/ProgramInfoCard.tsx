import Image from 'next/image';

interface ProgramInfoCardProps {
    title?: string;
    description?: string;
    bullets?: string[];
}

export default function ProgramInfoCard({
    title = "Nombre del Programa Ejemplo",
    description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet.",
    bullets = [
        "Lorem ipsum dolor sit amet",
        "Consectetur adipiscing elit",
        "Sed do eiusmod tempor incididunt"
    ]
}: ProgramInfoCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden my-8 border border-slate-100">
            <div className="grid md:grid-cols-2">
                {/* Image Side */}
                <div className="relative h-64 md:h-auto bg-slate-200">
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                        <span className="text-sm">Placeholder Image (Horizontal)</span>
                    </div>
                    {/* Uncomment when real image is available
          <Image 
            src="/path/to/image.jpg" 
            alt={title}
            fill
            className="object-cover"
          />
          */}
                </div>

                {/* Content Side */}
                <div className="p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-serif font-bold text-primary mb-4">{title}</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                        {description}
                    </p>
                    <ul className="space-y-3">
                        {bullets.map((bullet, index) => (
                            <li key={index} className="flex items-start gap-3 text-slate-700">
                                <span className="text-accent mt-1">✓</span>
                                <span>{bullet}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
