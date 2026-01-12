import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { TaskStatus } from "@/features/tasks/types"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        [TaskStatus.BACKLOG]: "bg-gray-100 text-gray-800 border-gray-200",
        [TaskStatus.TODO]: "bg-blue-100 text-blue-800 border-blue-200",
        [TaskStatus.IN_REVIEW]: "bg-purple-100 text-purple-800 border-purple-200",
        [TaskStatus.IN_PROGRESS]: "bg-yellow-100 text-yellow-800 border-yellow-200",
        [TaskStatus.DONE]: "bg-green-100 text-green-800 border-green-200",
        [TaskStatus.IN_TESTING]: "bg-orange-100 text-orange-800 border-orange-200",
        [TaskStatus.IN_PROD]: "bg-teal-100 text-teal-800 border-teal-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
