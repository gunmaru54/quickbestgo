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
  { slug: 'random-number-generator',      dictKey: 'random_number_generator',      icon: Hash,          schemaCategory: 'UtilityApplication',      category: 'random'       },
  { slug: 'password-generator',           dictKey: 'password_generator',           icon: Lock,          schemaCategory: 'SecurityApplication',     category: 'random'       },
  { slug: 'coin-flip',                    dictKey: 'coin_flip',                    icon: CircleDot,     schemaCategory: 'EntertainmentApplication', category: 'random'       },
  { slug: 'wheel-spinner',                dictKey: 'wheel_spinner',                icon: RotateCw,      schemaCategory: 'EntertainmentApplication', category: 'random'       },
  { slug: 'percentage-calculator',        dictKey: 'percentage_calculator',        icon: Percent,       schemaCategory: 'UtilityApplication',      category: 'calculators'  },
  { slug: 'age-calculator',               dictKey: 'age_calculator',               icon: Calendar,      schemaCategory: 'UtilityApplication',      category: 'calculators'  },
  { slug: 'compound-interest-calculator', dictKey: 'compound_interest_calculator', icon: TrendingUp,    schemaCategory: 'FinanceApplication',      category: 'calculators'  },
  { slug: 'tip-calculator',               dictKey: 'tip_calculator',               icon: Receipt,       schemaCategory: 'UtilityApplication',      category: 'calculators'  },
  { slug: 'gpa-calculator',               dictKey: 'gpa_calculator',               icon: GraduationCap, schemaCategory: 'EducationApplication',    category: 'calculators'  },
  { slug: 'bmi-calculator',               dictKey: 'bmi_calculator',               icon: Activity,      schemaCategory: 'HealthApplication',       category: 'health'       },
  { slug: 'calorie-calculator',           dictKey: 'calorie_calculator',           icon: Flame,         schemaCategory: 'HealthApplication',       category: 'health'       },
  { slug: 'unit-converter',               dictKey: 'unit_converter',               icon: Ruler,         schemaCategory: 'UtilityApplication',      category: 'converters'   },
  { slug: 'qr-code-generator',            dictKey: 'qr_code_generator',            icon: QrCode,        schemaCategory: 'UtilityApplication',      category: 'converters'   },
  { slug: 'json-formatter',               dictKey: 'json_formatter',               icon: Braces,        schemaCategory: 'DeveloperApplication',    category: 'developer'    },
  { slug: 'base64',                       dictKey: 'base64',                       icon: FileCode,      schemaCategory: 'DeveloperApplication',    category: 'developer'    },
  { slug: 'url-encoder',                  dictKey: 'url_encoder',                  icon: Link,          schemaCategory: 'DeveloperApplication',    category: 'developer'    },
  { slug: 'color-converter',              dictKey: 'color_converter',              icon: Palette,       schemaCategory: 'DeveloperApplication',    category: 'developer'    },
  { slug: 'word-counter',                 dictKey: 'word_counter',                 icon: FileText,      schemaCategory: 'DeveloperApplication',    category: 'utilities'    },
  { slug: 'days-between-dates',           dictKey: 'days_between_dates',           icon: CalendarDays,  schemaCategory: 'UtilityApplication',      category: 'calculators'  },
  { slug: 'timezone-converter',           dictKey: 'timezone_converter',           icon: Globe,         schemaCategory: 'UtilityApplication',      category: 'converters'   },
  { slug: 'currency-exchange-calculator', dictKey: 'currency_exchange_calculator', icon: DollarSign,    schemaCategory: 'FinanceApplication',      category: 'converters'   },
  { slug: 'loan-calculator',              dictKey: 'loan_calculator',              icon: Landmark,      schemaCategory: 'FinanceApplication',      category: 'calculators'  },
  { slug: 'retirement-calculator',        dictKey: 'retirement_calculator',        icon: PiggyBank,     schemaCategory: 'FinanceApplication',      category: 'calculators'  },
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
  cardBorder: string;
  emoji: string;
}

// Gradient Design System — brand token mapping
// primary=#990FFA  secondary=#E60076  warning=#D97706  success=#16A34A  danger=#DC2626
export const CATEGORY_THEMES: Record<ToolCategory, CategoryTheme> = {
  calculators: {
    primaryBtn:  'bg-[#990FFA] hover:bg-[#7A0CC8] active:bg-[#6500A0]',
    shadow:      'shadow-purple-300/40',
    ring:        'focus:ring-[#990FFA]/40',
    accent:      'text-[#990FFA]',
    accentBg:    'bg-[#990FFA]/10 dark:bg-[#990FFA]/10',
    accentBorder:'border-[#990FFA]/20 dark:border-[#990FFA]/15',
    accentLight: 'text-[#990FFA]/70',
    activeSolid: 'bg-[#990FFA] text-white border-[#990FFA]',
    hoverBorder: 'hover:border-[#990FFA]/50',
    gradient:    'from-[#990FFA]/5 via-white to-[#E60076]/3 dark:from-[#990FFA]/5 dark:via-[#0a0a0a] dark:to-[#E60076]/3',
    badge:       'bg-[#990FFA]/10 text-[#990FFA]',
    iconBg:      'bg-[#990FFA]/10 dark:bg-[#990FFA]/10',
    iconColor:   'text-[#990FFA]',
    cardBorder:  'border-[#990FFA]/20 dark:border-[#990FFA]/15',
    emoji: '🔢',
  },
  developer: {
    primaryBtn:  'bg-[#E60076] hover:bg-[#C20063] active:bg-[#990050]',
    shadow:      'shadow-pink-300/40',
    ring:        'focus:ring-[#E60076]/40',
    accent:      'text-[#E60076]',
    accentBg:    'bg-[#E60076]/10 dark:bg-[#E60076]/10',
    accentBorder:'border-[#E60076]/20 dark:border-[#E60076]/15',
    accentLight: 'text-[#E60076]/70',
    activeSolid: 'bg-[#E60076] text-white border-[#E60076]',
    hoverBorder: 'hover:border-[#E60076]/50',
    gradient:    'from-[#E60076]/5 via-white to-[#990FFA]/3 dark:from-[#E60076]/5 dark:via-[#0a0a0a] dark:to-[#990FFA]/3',
    badge:       'bg-[#E60076]/10 text-[#E60076]',
    iconBg:      'bg-[#E60076]/10 dark:bg-[#E60076]/10',
    iconColor:   'text-[#E60076]',
    cardBorder:  'border-[#E60076]/20 dark:border-[#E60076]/15',
    emoji: '⌨️',
  },
  random: {
    primaryBtn:  'bg-[#D97706] hover:bg-[#B45309] active:bg-[#92400E]',
    shadow:      'shadow-amber-300/40',
    ring:        'focus:ring-[#D97706]/40',
    accent:      'text-[#D97706]',
    accentBg:    'bg-[#D97706]/10 dark:bg-[#D97706]/10',
    accentBorder:'border-[#D97706]/20 dark:border-[#D97706]/15',
    accentLight: 'text-[#D97706]/70',
    activeSolid: 'bg-[#D97706] text-white border-[#D97706]',
    hoverBorder: 'hover:border-[#D97706]/50',
    gradient:    'from-[#D97706]/5 via-white to-[#D97706]/3 dark:from-[#D97706]/5 dark:via-[#0a0a0a] dark:to-[#D97706]/3',
    badge:       'bg-[#D97706]/10 text-[#D97706]',
    iconBg:      'bg-[#D97706]/10 dark:bg-[#D97706]/10',
    iconColor:   'text-[#D97706]',
    cardBorder:  'border-[#D97706]/20 dark:border-[#D97706]/15',
    emoji: '🎲',
  },
  converters: {
    primaryBtn:  'bg-[#16A34A] hover:bg-[#15803D] active:bg-[#166534]',
    shadow:      'shadow-green-300/40',
    ring:        'focus:ring-[#16A34A]/40',
    accent:      'text-[#16A34A]',
    accentBg:    'bg-[#16A34A]/10 dark:bg-[#16A34A]/10',
    accentBorder:'border-[#16A34A]/20 dark:border-[#16A34A]/15',
    accentLight: 'text-[#16A34A]/70',
    activeSolid: 'bg-[#16A34A] text-white border-[#16A34A]',
    hoverBorder: 'hover:border-[#16A34A]/50',
    gradient:    'from-[#16A34A]/5 via-white to-[#16A34A]/3 dark:from-[#16A34A]/5 dark:via-[#0a0a0a] dark:to-[#16A34A]/3',
    badge:       'bg-[#16A34A]/10 text-[#16A34A]',
    iconBg:      'bg-[#16A34A]/10 dark:bg-[#16A34A]/10',
    iconColor:   'text-[#16A34A]',
    cardBorder:  'border-[#16A34A]/20 dark:border-[#16A34A]/15',
    emoji: '🔄',
  },
  health: {
    primaryBtn:  'bg-[#DC2626] hover:bg-[#B91C1C] active:bg-[#991B1B]',
    shadow:      'shadow-red-300/40',
    ring:        'focus:ring-[#DC2626]/40',
    accent:      'text-[#DC2626]',
    accentBg:    'bg-[#DC2626]/10 dark:bg-[#DC2626]/10',
    accentBorder:'border-[#DC2626]/20 dark:border-[#DC2626]/15',
    accentLight: 'text-[#DC2626]/70',
    activeSolid: 'bg-[#DC2626] text-white border-[#DC2626]',
    hoverBorder: 'hover:border-[#DC2626]/50',
    gradient:    'from-[#DC2626]/5 via-white to-[#DC2626]/3 dark:from-[#DC2626]/5 dark:via-[#0a0a0a] dark:to-[#DC2626]/3',
    badge:       'bg-[#DC2626]/10 text-[#DC2626]',
    iconBg:      'bg-[#DC2626]/10 dark:bg-[#DC2626]/10',
    iconColor:   'text-[#DC2626]',
    cardBorder:  'border-[#DC2626]/20 dark:border-[#DC2626]/15',
    emoji: '❤️',
  },
  utilities: {
    primaryBtn:  'bg-[#7C3AED] hover:bg-[#6D28D9] active:bg-[#5B21B6]',
    shadow:      'shadow-violet-300/40',
    ring:        'focus:ring-[#7C3AED]/40',
    accent:      'text-[#7C3AED]',
    accentBg:    'bg-[#7C3AED]/10 dark:bg-[#7C3AED]/10',
    accentBorder:'border-[#7C3AED]/20 dark:border-[#7C3AED]/15',
    accentLight: 'text-[#7C3AED]/70',
    activeSolid: 'bg-[#7C3AED] text-white border-[#7C3AED]',
    hoverBorder: 'hover:border-[#7C3AED]/50',
    gradient:    'from-[#7C3AED]/5 via-white to-[#7C3AED]/3 dark:from-[#7C3AED]/5 dark:via-[#0a0a0a] dark:to-[#7C3AED]/3',
    badge:       'bg-[#7C3AED]/10 text-[#7C3AED]',
    iconBg:      'bg-[#7C3AED]/10 dark:bg-[#7C3AED]/10',
    iconColor:   'text-[#7C3AED]',
    cardBorder:  'border-[#7C3AED]/20 dark:border-[#7C3AED]/15',
    emoji: '📝',
  },
};

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return TOOLS.find(t => t.slug === slug);
}
