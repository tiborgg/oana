import { observer } from 'mobx-react-lite';
import { EntityNumberFieldProxy } from './entityNumberFieldProxy';
import { Input } from '../ui/input';

type Props = {
  item: EntityNumberFieldProxy;
}

export const EntityNumberField = observer(({ item }: Props) => {

  if (item.isEditing) {
    return (
      <Input
        value={item.value ?? ''}
        onChange={(e) => item.value = Number(e.target.value)}
        className="w-16" />
    );
  }

  return (
    <div className="px-[calc(0.75rem+1px)]">{item.value || '-'}</div>
  );
});