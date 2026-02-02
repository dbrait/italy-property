import {
  Scale,
  Stamp,
  Ruler,
  Compass,
  Home,
  Calculator,
  Key,
  Hammer,
  LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CategoryId } from '@/lib/types'

const categoryIcons: Record<CategoryId, LucideIcon> = {
  lawyer: Scale,
  notary: Stamp,
  geometra: Ruler,
  architect: Compass,
  real_estate_agent: Home,
  accountant: Calculator,
  property_manager: Key,
  contractor: Hammer,
}

interface CategoryIconProps {
  category: CategoryId
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function CategoryIcon({ category, size = 'md', className }: CategoryIconProps) {
  const Icon = categoryIcons[category] || Scale

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  }

  return <Icon className={cn(sizeClasses[size], className)} />
}
