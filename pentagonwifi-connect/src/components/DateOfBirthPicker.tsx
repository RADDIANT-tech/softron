
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ControllerRenderProps } from "react-hook-form";

interface DateOfBirthPickerProps {
  field: ControllerRenderProps<any, any>;
}

const DateOfBirthPicker = ({ field }: DateOfBirthPickerProps) => {
  const [showYearPicker, setShowYearPicker] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-left font-normal py-3 px-2 h-auto border-2 rounded-lg",
            !field.value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-5 w-5" />
          {field.value ? format(field.value, "PPP") : <span>Date of Birth</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {showYearPicker ? (
          <div className="grid grid-cols-4 gap-2 p-4 max-h-[300px] overflow-y-auto">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => {
                  const newDate = field.value ? new Date(field.value) : new Date();
                  newDate.setFullYear(year);
                  field.onChange(newDate);
                  setShowYearPicker(false);
                }}
                className="hover:bg-primary/10 text-sm p-2 rounded-lg"
              >
                {year}
              </button>
            ))}
          </div>
        ) : (
          <div className="p-3">
            <div className="flex justify-between items-center mb-2">
              <button
                type="button"
                onClick={() => setShowYearPicker(true)}
                className="text-primary font-semibold hover:underline"
              >
                {field.value ? field.value.getFullYear() : "Select Year"}
              </button>
            </div>
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              initialFocus
              disabled={(date) => {
                const now = new Date();
                const hundredYearsAgo = new Date();
                hundredYearsAgo.setFullYear(now.getFullYear() - 100);
                return date > now || date < hundredYearsAgo;
              }}
              numberOfMonths={1}
              className="rounded-md"
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default DateOfBirthPicker;
