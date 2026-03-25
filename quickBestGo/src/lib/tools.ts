import { Hash, Lock, Calendar, CircleDot, RotateCw, QrCode, Percent, Activity, Flame, TrendingUp, Receipt, Ruler, GraduationCap, FileCode, Link, Braces, Palette, FileText, CalendarDays, Globe, DollarSign, Landmark, PiggyBank, type LucideIcon } from 'lucide-react';

export type ToolCategory = 'calculators' | 'developer' | 'random' | 'converters' | 'health' | 'utilities';

export interface ToolConfig {
  slug: string;
  dictKey: string;
  icon: LucideIcon;
  schemaCategory: string;
  category: ToolCategory;
}

export const TOOLS: ToolConfig[] = [
  { slug: 'random-number-generator',      dictKey: 'random_number_generator',      icon: Hash,          schemaCategory: 'UtilityApplication',   category: 'random'       },
  { slug: 'password-generator',           dictKey: 'password_generator',           icon: Lock,          schemaCategory: 'SecurityApplication',  category: 'random'       },
  { slug: 'coin-flip',                    dictKey: 'coin_flip',                    icon: CircleDot,     schemaCategory: 'EntertainmentApplication', category: 'random'   },
  { slug: 'wheel-spinner',                dictKey: 'wheel_spinner',                icon: RotateCw,      schemaCategory: 'EntertainmentApplication', category: 'random'   },
  { slug: 'percentage-calculator',        dictKey: 'percentage_calculator',        icon: Percent,       schemaCategory: 'UtilityApplication',   category: 'calculators'  },
  { slug: 'age-calculator',               dictKey: 'age_calculator',               icon: Calendar,      schemaCategory: 'UtilityApplication',   category: 'calculators'  },
  { slug: 'compound-interest-calculator', dictKey: 'compound_interest_calculator', icon: TrendingUp,    schemaCategory: 'FinanceApplication',   category: 'calculators'  },
  { slug: 'tip-calculator',               dictKey: 'tip_calculator',               icon: Receipt,       schemaCategory: 'UtilityApplication',   category: 'calculators'  },
  { slug: 'gpa-calculator',               dictKey: 'gpa_calculator',               icon: GraduationCap, schemaCategory: 'EducationApplication', category: 'calculators'  },
  { slug: 'bmi-calculator',               dictKey: 'bmi_calculator',               icon: Activity,      schemaCategory: 'HealthApplication',    category: 'health'       },
  { slug: 'calorie-calculator',           dictKey: 'calorie_calculator',           icon: Flame,         schemaCategory: 'HealthApplication',    category: 'health'       },
  { slug: 'unit-converter',               dictKey: 'unit_converter',               icon: Ruler,         schemaCategory: 'UtilityApplication',   category: 'converters'   },
  { slug: 'qr-code-generator',            dictKey: 'qr_code_generator',            icon: QrCode,        schemaCategory: 'UtilityApplication',   category: 'converters'   },
  { slug: 'json-formatter',               dictKey: 'json_formatter',               icon: Braces,        schemaCategory: 'DeveloperApplication', category: 'developer'    },
  { slug: 'base64',                       dictKey: 'base64',                       icon: FileCode,      schemaCategory: 'DeveloperApplication', category: 'developer'    },
  { slug: 'url-encoder',                  dictKey: 'url_encoder',                  icon: Link,          schemaCategory: 'DeveloperApplication', category: 'developer'    },
  { slug: 'color-converter',              dictKey: 'color_converter',              icon: Palette,       schemaCategory: 'DeveloperApplication', category: 'developer'    },
  { slug: 'word-counter',                 dictKey: 'word_counter',                 icon: FileText,      schemaCategory: 'DeveloperApplication', category: 'utilities'    },
  { slug: 'days-between-dates',           dictKey: 'days_between_dates',           icon: CalendarDays,  schemaCategory: 'UtilityApplication',   category: 'calculators'  },
  { slug: 'timezone-converter',           dictKey: 'timezone_converter',           icon: Globe,         schemaCategory: 'UtilityApplication',   category: 'converters'   },
  { slug: 'currency-exchange-calculator', dictKey: 'currency_exchange_calculator', icon: DollarSign,    schemaCategory: 'FinanceApplication',   category: 'converters'   },
  { slug: 'loan-calculator',              dictKey: 'loan_calculator',              icon: Landmark,      schemaCategory: 'FinanceApplication',   category: 'calculators'  },
  { slug: 'retirement-calculator',        dictKey: 'retirement_calculator',        icon: PiggyBank,     schemaCategory: 'FinanceApplication',   category: 'calculators'  },
];

export interface CategoryTheme {
  primaryBtn: string;
  shadow: string;
  ring: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
  accentLight: string;
  activeSolid: string;
  hoverBorder: string;
  gradient: string;
  badge: string;
  iconBg: string;
  iconColor: string;
  emoji: string;
}

export const CATEGORY_THEMES: Record<ToolCategory, CategoryTheme> = {
  calculators: {
    primaryBtn: 'bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600',
    shadow: 'shadow-blue-200',
    ring: 'focus:ring-blue-500',
    accent: 'text-blue-600 dark:text-blue-400',
    accentBg: 'bg-blue-50 dark:bg-blue-900/20',
    accentBorder: 'border-blue-100 dark:border-blue-900/30',
    accentLight: 'text-blue-400 dark:text-blue-300',
    activeSolid: 'bg-blue-600 text-white border-blue-600',
    hoverBorder: 'hover:border-blue-400',
    gradient: 'from-blue-50 via-white to-blue-50 dark:from-blue-950/20 dark:via-[#0a0a0a] dark:to-blue-950/20',
    badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    iconBg: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    emoji: '🔢',
  },
  developer: {
    primaryBtn: 'bg-violet-600 dark:bg-violet-700 hover:bg-violet-700 dark:hover:bg-violet-600',
    shadow: 'shadow-violet-200',
    ring: 'focus:ring-violet-500',
    accent: 'text-violet-600 dark:text-violet-400',
    accentBg: 'bg-violet-50 dark:bg-violet-900/20',
    accentBorder: 'border-violet-100 dark:border-violet-900/30',
    accentLight: 'text-violet-400 dark:text-violet-300',
    activeSolid: 'bg-violet-600 text-white border-violet-600',
    hoverBorder: 'hover:border-violet-400',
    gradient: 'from-violet-50 via-white to-violet-50 dark:from-violet-950/20 dark:via-[#0a0a0a] dark:to-violet-950/20',
    badge: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
    iconBg: 'bg-violet-50 dark:bg-violet-900/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
    emoji: '⌨️',
  },
  random: {
    primaryBtn: 'bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-500',
    shadow: 'shadow-orange-200',
    ring: 'focus:ring-orange-500',
    accent: 'text-orange-600 dark:text-orange-400',
    accentBg: 'bg-orange-50 dark:bg-orange-900/20',
    accentBorder: 'border-orange-100 dark:border-orange-900/30',
    accentLight: 'text-orange-400 dark:text-orange-300',
    activeSolid: 'bg-orange-500 text-white border-orange-500',
    hoverBorder: 'hover:border-orange-400',
    gradient: 'from-orange-50 via-white to-orange-50 dark:from-orange-950/20 dark:via-[#0a0a0a] dark:to-orange-950/20',
    badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    iconBg: 'bg-orange-50 dark:bg-orange-900/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
    emoji: '🎲',
  },
  converters: {
    primaryBtn: 'bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600',
    shadow: 'shadow-green-200',
    ring: 'focus:ring-green-500',
    accent: 'text-green-600 dark:text-green-400',
    accentBg: 'bg-green-50 dark:bg-green-900/20',
    accentBorder: 'border-green-100 dark:border-green-900/30',
    accentLight: 'text-green-400 dark:text-green-300',
    activeSolid: 'bg-green-600 text-white border-green-600',
    hoverBorder: 'hover:border-green-400',
    gradient: 'from-green-50 via-white to-green-50 dark:from-green-950/20 dark:via-[#0a0a0a] dark:to-green-950/20',
    badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    iconBg: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400',
    emoji: '🔄',
  },
  health: {
    primaryBtn: 'bg-rose-600 dark:bg-rose-700 hover:bg-rose-700 dark:hover:bg-rose-600',
    shadow: 'shadow-rose-200',
    ring: 'focus:ring-rose-500',
    accent: 'text-rose-600 dark:text-rose-400',
    accentBg: 'bg-rose-50 dark:bg-rose-900/20',
    accentBorder: 'border-rose-100 dark:border-rose-900/30',
    accentLight: 'text-rose-400 dark:text-rose-300',
    activeSolid: 'bg-rose-600 text-white border-rose-600',
    hoverBorder: 'hover:border-rose-400',
    gradient: 'from-rose-50 via-white to-rose-50 dark:from-rose-950/20 dark:via-[#0a0a0a] dark:to-rose-950/20',
    badge: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
    iconBg: 'bg-rose-50 dark:bg-rose-900/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    emoji: '❤️',
  },
  utilities: {
    primaryBtn: 'bg-teal-600 dark:bg-teal-700 hover:bg-teal-700 dark:hover:bg-teal-600',
    shadow: 'shadow-teal-200',
    ring: 'focus:ring-teal-500',
    accent: 'text-teal-600 dark:text-teal-400',
    accentBg: 'bg-teal-50 dark:bg-teal-900/20',
    accentBorder: 'border-teal-100 dark:border-teal-900/30',
    accentLight: 'text-teal-400 dark:text-teal-300',
    activeSolid: 'bg-teal-600 text-white border-teal-600',
    hoverBorder: 'hover:border-teal-400',
    gradient: 'from-teal-50 via-white to-teal-50 dark:from-teal-950/20 dark:via-[#0a0a0a] dark:to-teal-950/20',
    badge: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
    iconBg: 'bg-teal-50 dark:bg-teal-900/20',
    iconColor: 'text-teal-600 dark:text-teal-400',
    emoji: '📝',
  },
};

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return TOOLS.find(t => t.slug === slug);
}
