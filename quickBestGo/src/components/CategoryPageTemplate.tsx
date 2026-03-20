import Link from 'next/link';
import { type ToolCategory, type ToolConfig } from '@/lib/tools';

const CATEGORY_META: Record<ToolCategory, {
  color: string;
  iconBg: string;
  iconColor: string;
  hoverBorder: string;
  badgeBg: string;
  sectionBorder: string;
  heroBg: string;
  heroText: string;
  emoji: string;
}> = {
  calculators: {
    color: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    hoverBorder: 'hover:border-blue-400 dark:hover:border-blue-500',
    badgeBg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    sectionBorder: 'border-blue-200 dark:border-blue-900',
    heroBg: 'from-blue-50 to-white dark:from-blue-950/30 dark:to-[#0a0a0a]',
    heroText: 'text-blue-600 dark:text-blue-400',
    emoji: '🔢',
  },
  developer: {
    color: 'text-violet-600 dark:text-violet-400',
    iconBg: 'bg-violet-50 dark:bg-violet-900/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
    hoverBorder: 'hover:border-violet-400 dark:hover:border-violet-500',
    badgeBg: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
    sectionBorder: 'border-violet-200 dark:border-violet-900',
    heroBg: 'from-violet-50 to-white dark:from-violet-950/30 dark:to-[#0a0a0a]',
    heroText: 'text-violet-600 dark:text-violet-400',
    emoji: '⌨️',
  },
  random: {
    color: 'text-orange-600 dark:text-orange-400',
    iconBg: 'bg-orange-50 dark:bg-orange-900/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
    hoverBorder: 'hover:border-orange-400 dark:hover:border-orange-500',
    badgeBg: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    sectionBorder: 'border-orange-200 dark:border-orange-900',
    heroBg: 'from-orange-50 to-white dark:from-orange-950/30 dark:to-[#0a0a0a]',
    heroText: 'text-orange-600 dark:text-orange-400',
    emoji: '🎲',
  },
  converters: {
    color: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400',
    hoverBorder: 'hover:border-green-400 dark:hover:border-green-500',
    badgeBg: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    sectionBorder: 'border-green-200 dark:border-green-900',
    heroBg: 'from-green-50 to-white dark:from-green-950/30 dark:to-[#0a0a0a]',
    heroText: 'text-green-600 dark:text-green-400',
    emoji: '🔄',
  },
  health: {
    color: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-rose-50 dark:bg-rose-900/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    hoverBorder: 'hover:border-rose-400 dark:hover:border-rose-500',
    badgeBg: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
    sectionBorder: 'border-rose-200 dark:border-rose-900',
    heroBg: 'from-rose-50 to-white dark:from-rose-950/30 dark:to-[#0a0a0a]',
    heroText: 'text-rose-600 dark:text-rose-400',
    emoji: '❤️',
  },
  utilities: {
    color: 'text-teal-600 dark:text-teal-400',
    iconBg: 'bg-teal-50 dark:bg-teal-900/20',
    iconColor: 'text-teal-600 dark:text-teal-400',
    hoverBorder: 'hover:border-teal-400 dark:hover:border-teal-500',
    badgeBg: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
    sectionBorder: 'border-teal-200 dark:border-teal-900',
    heroBg: 'from-teal-50 to-white dark:from-teal-950/30 dark:to-[#0a0a0a]',
    heroText: 'text-teal-600 dark:text-teal-400',
    emoji: '📝',
  },
};

interface CatDict {
  slug: string;
  name: string;
  meta_title: string;
  meta_description: string;
  hero_title: string;
  hero_desc: string;
  about_title: string;
  about_p1: string;
  about_p2: string;
}

interface ToolDict {
  name: string;
  description: string;
  category: string;
}

interface CategoryPageTemplateProps {
  tools: ToolConfig[];
  dict: {
    categories: Record<string, CatDict>;
    tools: Record<string, ToolDict>;
  };
  lang: string;
  catKey: ToolCategory;
}

export default function CategoryPageTemplate({ tools, dict, lang, catKey }: CategoryPageTemplateProps) {
  const meta = CATEGORY_META[catKey];
  const catDict = dict.categories[catKey];

  return (
    <div>
      {/* Hero section */}
      <div className={`bg-gradient-to-b ${meta.heroBg} border-b dark:border-gray-800`}>
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className={`inline-flex items-center gap-2 text-sm font-semibold ${meta.badgeBg} px-4 py-1.5 rounded-full mb-5`}>
              <span>{meta.emoji}</span>
              <span>{catDict.name}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-5 leading-tight">
              {catDict.hero_title}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              {catDict.hero_desc}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Back link */}
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-10 transition-colors"
        >
          ← Back to all tools
        </Link>

        {/* Tool grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-16">
          {tools.map((tool) => {
            const t = dict.tools?.[tool.dictKey];
            if (!t) return null;
            return (
              <Link
                key={tool.slug}
                href={`/${lang}/${tool.slug}`}
                className={`group flex flex-col p-5 bg-white dark:bg-[#1a1a1a] border-2 border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md ${meta.hoverBorder} transition-all duration-200`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${meta.iconBg} ${meta.iconColor} group-hover:scale-110 transition-transform`}>
                    <tool.icon size={22} />
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${meta.badgeBg}`}>
                    {catDict.name}
                  </span>
                </div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1.5 leading-snug">
                  {t.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">
                  {t.description}
                </p>
                <div className={`mt-4 text-xs font-bold flex items-center gap-1 ${meta.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Open tool →
                </div>
              </Link>
            );
          })}
        </div>

        {/* SEO about section */}
        <article className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-3xl border dark:border-gray-800 transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{catDict.about_title}</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{catDict.about_p1}</p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{catDict.about_p2}</p>
        </article>
      </div>
    </div>
  );
}
