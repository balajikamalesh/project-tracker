import { cn } from "@/lib/utils";
import { differenceInDays, format } from "date-fns";

type TaskDateProps = {
    value: string;
    className?: string;
}

export const TaskDate = ({ value, className }: TaskDateProps) => {
    const today = new Date();
    const dueDate = new Date(value);
    const daysDifference = differenceInDays(dueDate, today);

    let textColor = "text-muted-foreground";

    if (daysDifference <= 3) {
        textColor = "text-red-500";
    } else if (daysDifference <= 7) {
        textColor = "text-orange-500";
    } else if (daysDifference <= 14) {
        textColor = "text-yellow-500";
    } else {
        textColor = "text-green-500";
    }

    return (
        <div className={textColor}>
            <span>
                {format(dueDate, "PPP")}
            </span>
        </div>
    );
}