import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { CalendarIcon } from 'lucide-react';
import { EntityDateTimeFieldProxy } from './entityDateTimeFieldProxy';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Button } from '../ui/button';

type Props = {
  item: EntityDateTimeFieldProxy;
}

export const EntityDateTimeField = observer(({ item }: Props) => {

  if (item.isEditing) {
    const selected = item.value?.toDate();

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!item.value}
            className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal w-full">
            <CalendarIcon />
            {item.value ? item.value.format("DD MMM YYYY") : <span>Selectează data</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selected}
            month={item.calendarMonth ?? undefined}
            onMonthChange={item.handleCalendarMonthChange}
            onSelect={(value) => {
              if (!value) {
                item.value = null;
                return;
              }

              item.value = dayjs.utc({
                year: value.getFullYear(),
                month: value.getMonth(),
                date: value.getDate()
              })
            }} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="px-[calc(0.75rem+1px)]">{item.value?.format('DD MMM YYYY') || '-'}</div>
  );
});