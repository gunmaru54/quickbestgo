import { Hash, Lock, Calendar, CircleDot, RotateCw, QrCode, Percent, type LucideIcon } from 'lucide-react';

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
];
