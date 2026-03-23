import { ReactNode } from 'react';
import { CategoryTheme } from '@/lib/tools';

interface ToolPageTemplateProps {
  schemas: object | object[];
  title: string;
  toolComponent: ReactNode;
  about: {
    title: string;
    p1: string;
    p2: string;
    p3: string;
  };
  theme: CategoryTheme;
  icon: ReactNode;
}

export default function ToolPageTemplate({ schemas, title, toolComponent, about, theme, icon }: ToolPageTemplateProps) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      {/* Category Hero */}
      <section className={`bg-gradient-to-br ${theme.gradient} border-b dark:border-gray-800 py-10 px-4`}>
        <div className="max-w-3xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 ${theme.badge} text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wide`}>
            <span className={`${theme.iconColor}`}>{icon}</span>
            <span>{theme.emoji}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
            {title}
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            {toolComponent}
          </div>

          <article className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-3xl border dark:border-gray-800 transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{about.title}</h2>
            <p>{about.p1}</p>
            <p>{about.p2}</p>
            <p>{about.p3}</p>
          </article>
        </div>
      </div>
    </>
  );
}
