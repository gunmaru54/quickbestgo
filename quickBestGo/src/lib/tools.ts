import { Hash, Lock, Calendar, CircleDot, RotateCw, QrCode, Percent, Activity, Flame, TrendingUp, Receipt, Ruler, GraduationCap, FileCode, Link, Braces, Palette, type LucideIcon } from 'lucide-react';

export type ToolCategory = 'calculators' | 'developer' | 'random' | 'converters' | 'health';

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
];
