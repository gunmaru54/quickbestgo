import { ReactNode } from 'react';

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
}

export default function ToolPageTemplate({ schemas, title, toolComponent, about }: ToolPageTemplateProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-center text-gray-900 dark:text-white mb-8">
          {title}
        </h1>

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
  );
}
