import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
 return <button className={cn('btn-primary', className)} {...props} />
}
