import { cn } from "@/lib/utils";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "./ui/card";

type Props = {
  title: string;
  value: number;
  variant: "up" | "down";
  increaseValue: number;
};

const COLOR_MAP = {
  up: "text-emerald-500",
  down: "text-red-500",
};

const AnalyticsCard = ({ title, value, variant, increaseValue }: Props) => {
  const iconColor = COLOR_MAP[variant];
  const increaseValueColro = COLOR_MAP[variant];

  const Icon = variant === "up" ? FaCaretUp : FaCaretDown;

  return (
    <Card className="shadow-none border-none w-full">
      <CardHeader className="px-7 py-6">
        <div className="flex items-center gap-x-2.5">
          <CardDescription className="flex items-center gap-x-2 font-medium overflow-hidden">
            <span className="truncate text-base">{title}</span>
          </CardDescription>
          <div className="flex items-center gap-x-1">
            <Icon className={cn("size-4", iconColor)} />
            <span
              className={cn(
                increaseValueColro,
                "truncate text-base font-medium"
              )}
            >
              {increaseValue}
            </span>
          </div>
        </div>
        <CardTitle className="3xl font-semibold">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default AnalyticsCard;
