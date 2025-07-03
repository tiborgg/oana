import { useEffect, useState } from 'react';
import { ProductListPageState } from './productListPageState';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { EntityTextField } from '@/components/input/entityTextField';
import { EntityAutocompleteTextField } from '@/components/input/entityAutocompleteTextField';
import { EntityDateTimeField } from '@/components/input/entityDateTimeField';
import { EntitySelectField } from '@/components/input/entitySelectField';

export const ProductListPage = observer(() => {

  const [model] = useState(() => new ProductListPageState());
  const params = useParams();

  useEffect(() => {
    model.mounted();
    return () =>
      model.unmounted();
  }, [model, params]);

  return (
    <div>
      <div className="bg-background sticky top-0 grid grid-cols-2 h-16 shrink-0 items-center gap-2 border-b px-4">
        <div>
          <h3 className="font-bold text-xl">
            Produse
          </h3>
        </div>

        <div className="flex justify-end gap-2">

          <Button
            variant="default"
            onClick={model.handleAddButtonClick}>
            Adaugă
          </Button>

          <Button
            variant="outline">
            Importă
          </Button>

          <Button
            variant="outline"
            onClick={model.handleSaveButtonClick}>
            Salvează
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-normal pl-4">Nume</TableHead>
            <TableHead className="whitespace-normal px-[calc(1.25rem+1px)]">U.M.</TableHead>
            <TableHead className="whitespace-normal px-[calc(1.25rem+1px)]">Mod de ambalare</TableHead>
            <TableHead className="whitespace-normal px-[calc(1.25rem+1px)]">Mod de depozitare</TableHead>
            <TableHead className="whitespace-normal px-[calc(1.25rem+1px)]">Mod de folosire</TableHead>
            <TableHead className="whitespace-normal px-[calc(1.25rem+1px)]">Inregistrat la</TableHead>
            <TableHead className="whitespace-normal px-[calc(1.25rem+1px)]">Observatii</TableHead>
            <TableHead className="whitespace-normal px-[calc(1.25rem+1px)]">Actiuni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {model.items.map((item, index) => (

            <TableRow
              key={index}
              className={[
                item.isDirty ? 'bg-yellow-100 hover:bg-yellow-200' : '',
                item.isDeleted ? 'bg-red-100 hover:bg-red-200' : ''
              ].join(' ')}>

              <TableCell className="w-[20%] pl-1">
                <EntityTextField
                  item={item.name} />
              </TableCell>
              <TableCell className="w-[10%]">
                <EntitySelectField
                  item={item.unit} />
              </TableCell>
              <TableCell className="w-[10%]">
                <EntityAutocompleteTextField
                  item={item.packagingType} />
              </TableCell>
              <TableCell className="w-[10%]">
                <EntityAutocompleteTextField
                  item={item.storageType} />
              </TableCell>
              <TableCell className="w-[10%]">
                <EntityAutocompleteTextField
                  item={item.usageType} />
              </TableCell>
              <TableCell className="w-[10%]">
                <EntityDateTimeField
                  item={item.registeredAt} />
              </TableCell>
              <TableCell className="w-[20%]">
                <EntityTextField
                  item={item.observations} />
              </TableCell>
              <TableCell className="w-[10%]">

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={evt => item.setDeleted(!item.isDeleted)}>
                  <Trash />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={evt => item.setEditing(!item.isEditing)}>
                  <Pencil />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});