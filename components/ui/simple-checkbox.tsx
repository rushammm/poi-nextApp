'use client'

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckboxProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

const SimpleCheckbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, checked = false, onCheckedChange, disabled = false, className, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(checked);

    React.useEffect(() => {
      setIsChecked(checked);
    }, [checked]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked;
      setIsChecked(newChecked);
      if (onCheckedChange) {
        onCheckedChange(newChecked);
      }
    };

    return (
      <div className="relative flex items-center">
        <input
          type="checkbox"
          id={id}
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            "h-4 w-4 shrink-0 rounded-sm border border-gray-300 flex items-center justify-center transition-colors",
            isChecked && "bg-black border-black",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          {isChecked && <Check className="h-3 w-3 text-white" />}
        </div>
      </div>
    );
  }
);

SimpleCheckbox.displayName = "SimpleCheckbox";

export { SimpleCheckbox };
