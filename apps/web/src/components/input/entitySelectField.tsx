import { observer } from 'mobx-react-lite';
import { EntitySelectFieldProxy } from './entitySelectFieldProxy';
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '../ui/select';

type Props = {
  item: EntitySelectFieldProxy;
}

export const EntitySelectField = observer(({ item }: Props) => {

  if (item.isEditing) {
    return (
      <Select
        value={item.value ?? undefined}
        onValueChange={value => item.value = value || null}>

        <SelectTrigger
          className="bg-background cursor-pointer w-full">
          <SelectValue
            placeholder={item.value || 'Select a value'} />
        </SelectTrigger>
        <SelectContent>

          {Object
            .entries(item.items ?? {})
            .map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}

          <SelectSeparator />

          <SelectItem value={null!}>Nici una</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className="px-[calc(0.75rem+1px)]">{item.items?.[item.value ?? ''] || '-'}</div>
  );
});