import { Hash, Lock, Calendar, CircleDot, RotateCw, QrCode, Percent, Activity, Flame, TrendingUp, Receipt, Ruler, GraduationCap, FileCode, Link, Braces, Palette, type LucideIcon } from 'lucide-react';

export interface ToolConfig {
  slug: string;
  dictKey: string;
  icon: LucideIcon;
  schemaCategory: string;
}

export const TOOLS: ToolConfig[] = [
  { slug: 'random-number-generator', dictKey: 'random_number_generator', icon: Hash,       schemaCategory: 'UtilityApplication' },
  { slug: 'password-generator',      dictKey: 'password_generator',      icon: Lock,       schemaCategory: 'SecurityApplication' },
  { slug: 'coin-flip',               dictKey: 'coin_flip',               icon: CircleDot,  schemaCategory: 'EntertainmentApplication' },
  { slug: 'wheel-spinner',           dictKey: 'wheel_spinner',           icon: RotateCw,   schemaCategory: 'EntertainmentApplication' },
  { slug: 'age-calculator',          dictKey: 'age_calculator',          icon: Calendar,   schemaCategory: 'UtilityApplication' },
  { slug: 'qr-code-generator',       dictKey: 'qr_code_generator',       icon: QrCode,     schemaCategory: 'UtilityApplication' },
  { slug: 'percentage-calculator',   dictKey: 'percentage_calculator',   icon: Percent,    schemaCategory: 'UtilityApplication' },
  { slug: 'bmi-calculator',          dictKey: 'bmi_calculator',          icon: Activity,   schemaCategory: 'HealthApplication' },
  { slug: 'calorie-calculator',      dictKey: 'calorie_calculator',      icon: Flame,      schemaCategory: 'HealthApplication' },
  { slug: 'compound-interest-calculator', dictKey: 'compound_interest_calculator', icon: TrendingUp,    schemaCategory: 'FinanceApplication' },
  { slug: 'tip-calculator',          dictKey: 'tip_calculator',          icon: Receipt,    schemaCategory: 'UtilityApplication' },
  { slug: 'unit-converter',          dictKey: 'unit_converter',          icon: Ruler,      schemaCategory: 'UtilityApplication' },
  { slug: 'gpa-calculator',          dictKey: 'gpa_calculator',          icon: GraduationCap, schemaCategory: 'EducationApplication' },
  { slug: 'base64',                  dictKey: 'base64',                  icon: FileCode,      schemaCategory: 'DeveloperApplication' },
  { slug: 'url-encoder',             dictKey: 'url_encoder',             icon: Link,          schemaCategory: 'DeveloperApplication' },
  { slug: 'json-formatter',          dictKey: 'json_formatter',          icon: Braces,        schemaCategory: 'DeveloperApplication' },
  { slug: 'color-converter',         dictKey: 'color_converter',         icon: Palette,       schemaCategory: 'DeveloperApplication' },
];
