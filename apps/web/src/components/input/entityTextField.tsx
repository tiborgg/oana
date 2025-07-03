import { observer } from 'mobx-react-lite';
import { EntityTextFieldProxy } from './entityTextFieldProxy';
import { Input } from '../ui/input';

type Props = {
  item: EntityTextFieldProxy;
}

export const EntityTextField = observer(({ item }: Props) => {

  if (item.isEditing) {
    return (
      <Input
        value={item.value ?? ''}
        onChange={(e) => item.value = e.target.value}
        className="w-full bg-background" />
    );
  }

  return (
    <div className="px-[calc(0.75rem+1px)]">{item.value || '-'}</div>
  );
});