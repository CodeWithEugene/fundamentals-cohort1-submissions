import type { ReactNode, HTMLAttributes } from "react"
import { cn } from "../lib/utils"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn("rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("space-y-1.5", className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className, ...props }: CardProps) {
  return (
    <h2 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props}>
      {children}
    </h2>
  )
}

export function CardDescription({ children, className, ...props }: CardProps) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("pt-0", className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("flex items-center pt-0", className)} {...props}>
      {children}
    </div>
  )
}
