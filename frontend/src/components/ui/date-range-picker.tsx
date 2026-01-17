"use client"

import * as React from 'react';
import { format, parse, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval, getDay } from 'date-fns';
import { uz, ru, enUS } from 'date-fns/locale';
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '../../lib/utils';

interface DateRangePickerProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  availableDates?: string[];
  locale?: 'uz' | 'ru' | 'en';
  labels?: {
    from?: string;
    to?: string;
    clear?: string;
    selectRange?: string;
  };
}

const localeMap = {
  uz: uz,
  ru: ru,
  en: enUS,
};

const weekDaysMap = {
  uz: ['Ya', 'Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha'],
  ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  en: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
};

export function DateRangePicker({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  availableDates = [],
  locale = 'uz',
  labels = {},
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [baseMonth, setBaseMonth] = React.useState(new Date());
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null);
  const dateLocale = localeMap[locale];
  const weekDays = weekDaysMap[locale];

  // Defensive: Only parse valid date strings
  function safeParse(dateStr: string | undefined) {
    if (!dateStr) return null;
    const d = parse(dateStr, 'yyyy-MM-dd', new Date());
    return isNaN(d.getTime()) ? null : d;
  }

  const fromDate = safeParse(dateFrom);
  const toDate = safeParse(dateTo);

  // Defensive: Only use valid availableDates
  const validAvailableDates = Array.isArray(availableDates)
    ? availableDates.filter(d => {
        const dt = safeParse(d);
        return !!dt;
      })
    : [];
  const availableDateSet = new Set(validAvailableDates);
  const sortedDates = [...validAvailableDates].sort();
  const minDate = sortedDates.length > 0 ? safeParse(sortedDates[0]) : null;

  // Set initial base month
  React.useEffect(() => {
    if (fromDate) {
      setBaseMonth(fromDate);
    } else if (minDate) {
      setBaseMonth(minDate);
    } else {
      setBaseMonth(new Date());
    }
  }, []);

  // Handle date click
  const handleDateClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    if (!fromDate || (fromDate && toDate)) {
      // Start new selection
      onDateFromChange(dateStr);
      onDateToChange('');
    } else {
      // Complete selection
      if (date < fromDate) {
        onDateFromChange(dateStr);
        onDateToChange(format(fromDate, 'yyyy-MM-dd'));
      } else {
        onDateToChange(dateStr);
      }
      setIsOpen(false);
    }
  };

  // Check if date is available
  const isDateAvailable = (date: Date) => {
    if (availableDates.length === 0) return true;
    const dateStr = format(date, 'yyyy-MM-dd');
    return availableDateSet.has(dateStr);
  };

  // Check if date is in range
  const isInRange = (date: Date) => {
    if (!fromDate) return false;
    
    const endDate = toDate || hoverDate;
    if (!endDate) return false;
    
    const start = fromDate < endDate ? fromDate : endDate;
    const end = fromDate < endDate ? endDate : fromDate;
    
    return isWithinInterval(date, { start, end });
  };

  // Check if date is start or end
  const isRangeStart = (date: Date) => fromDate && isSameDay(date, fromDate);
  const isRangeEnd = (date: Date) => {
    if (toDate) return isSameDay(date, toDate);
    if (hoverDate && fromDate && !toDate) return isSameDay(date, hoverDate);
    return false;
  };

  // Clear selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateFromChange('');
    onDateToChange('');
    setHoverDate(null);
  };

  // Display text
  const displayValue = () => {
    if (dateFrom && dateTo) {
      const fromFormatted = format(parse(dateFrom, 'yyyy-MM-dd', new Date()), 'dd MMM yyyy', { locale: dateLocale });
      const toFormatted = format(parse(dateTo, 'yyyy-MM-dd', new Date()), 'dd MMM yyyy', { locale: dateLocale });
      return `${fromFormatted} — ${toFormatted}`;
    }
    if (dateFrom) {
      const fromFormatted = format(parse(dateFrom, 'yyyy-MM-dd', new Date()), 'dd MMM yyyy', { locale: dateLocale });
      return `${labels.from || 'Dan'}: ${fromFormatted}`;
    }
    return labels.selectRange || 'Davrni tanlang';
  };

  // Count selected days
  const selectedDaysCount = React.useMemo(() => {
    if (!dateFrom || !dateTo) return 0;
    const from = parse(dateFrom, 'yyyy-MM-dd', new Date());
    const to = parse(dateTo, 'yyyy-MM-dd', new Date());
    return Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }, [dateFrom, dateTo]);

  // Render single month
  const renderMonth = (monthDate: Date, showNavPrev: boolean, showNavNext: boolean) => {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  // Get starting day of week (0 = Sunday)
  const startDayOfWeek = getDay(monthStart);
  const safeStartDayOfWeek = Math.max(0, Number(startDayOfWeek) || 0);
  const emptyDays = Array(safeStartDayOfWeek).fill(null);

    return (
      <div className="p-4">
        {/* Month Header */}
        <div className="flex items-center justify-between mb-4 h-8">
          {showNavPrev ? (
            <button
              onClick={() => setBaseMonth(subMonths(baseMonth, 1))}
              className="p-1 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          ) : (
            <div className="w-7" />
          )}
          <span className="text-base font-semibold text-foreground">
            {format(monthDate, 'LLLL yyyy', { locale: dateLocale })}
          </span>
          {showNavNext ? (
            <button
              onClick={() => setBaseMonth(addMonths(baseMonth, 1))}
              className="p-1 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          ) : (
            <div className="w-7" />
          )}
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((day, i) => (
            <div key={i} className="h-10 flex items-center justify-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {emptyDays.map((_, i) => (
            <div key={`empty-${i}`} className="h-10" />
          ))}
          {daysInMonth.map((date) => {
            const available = isDateAvailable(date);
            const inRange = isInRange(date);
            const isStart = isRangeStart(date);
            const isEnd = isRangeEnd(date);
            const isSelected = isStart || isEnd;

            return (
              <div
                key={date.toISOString()}
                className={cn(
                  "h-10 relative flex items-center justify-center",
                  inRange && !isSelected && "bg-primary/10"
                )}
              >
                {/* Range background connector */}
                {inRange && !isStart && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-8 bg-primary/10" />
                )}
                {inRange && !isEnd && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-8 bg-primary/10" />
                )}
                
                <button
                  onClick={() => available && handleDateClick(date)}
                  onMouseEnter={() => fromDate && !toDate && setHoverDate(date)}
                  disabled={!available}
                  className={cn(
                    "relative z-10 h-9 w-9 rounded-full text-sm font-medium transition-all",
                    "hover:bg-primary/20 focus:outline-none",
                    !available && "text-muted-foreground/30 cursor-not-allowed hover:bg-transparent",
                    available && !isSelected && !inRange && "text-foreground",
                    inRange && !isSelected && "text-primary",
                    isSelected && "bg-primary text-primary-foreground hover:bg-primary",
                    isStart && !isEnd && toDate && "rounded-full",
                    isEnd && !isStart && "rounded-full"
                  )}
                >
                  {format(date, 'd')}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const leftMonth = baseMonth;
  const rightMonth = addMonths(baseMonth, 1);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal min-w-[280px] h-10",
            "hover:bg-accent hover:text-accent-foreground",
            "transition-all duration-200",
            !dateFrom && !dateTo && "text-muted-foreground",
            (dateFrom || dateTo) && "border-primary/50 bg-primary/5"
          )}
        >
          <CalendarDays className="mr-2 h-4 w-4 text-primary" />
          <span className="flex-1 truncate">{displayValue()}</span>
          {selectedDaysCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
              {selectedDaysCount} {locale === 'uz' ? 'kun' : locale === 'ru' ? 'дн.' : 'days'}
            </span>
          )}
          {(dateFrom || dateTo) && (
            <button
              onClick={handleClear}
              className="ml-2 p-1 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-background border shadow-xl rounded-xl" 
        align="start"
        onMouseLeave={() => setHoverDate(null)}
      >
        <div className="flex divide-x">
          {renderMonth(leftMonth, true, false)}
          {renderMonth(rightMonth, false, true)}
        </div>
      </PopoverContent>
    </Popover>
  );
}
