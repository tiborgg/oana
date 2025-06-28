import { useEffect, useState } from 'react';
import { ProductListPageState } from './productListPageState';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { ProductListItemTextField } from '@/components/input/entityTextField';
import { ProductListItemAutocompleteTextField } from '@/components/input/entityAutocompleteTextField';

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
            <TableHead className="whitespace-normal">Observatii</TableHead>
            <TableHead className="whitespace-normal">Nr. identif.</TableHead>
            <TableHead className="whitespace-normal">Mod de ambalare</TableHead>
            <TableHead className="whitespace-normal">Mod de depozitare</TableHead>
            <TableHead className="whitespace-normal">Mod de folosire</TableHead>
            <TableHead>Actiuni</TableHead>
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
                <ProductListItemTextField
                  item={item.name} />
              </TableCell>
              <TableCell className="w-[20%]">
                <ProductListItemTextField
                  item={item.observations} />
              </TableCell>
              <TableCell className="w-[10%]">
                <ProductListItemTextField
                  item={item.legalNumber} />
              </TableCell>
              <TableCell className="w-[10%]">
                <ProductListItemAutocompleteTextField
                  item={item.packagingType} />
              </TableCell>
              <TableCell className="w-[10%]">
                <ProductListItemAutocompleteTextField
                  item={item.storageType} />
              </TableCell>
              <TableCell className="w-[10%]">
                <ProductListItemAutocompleteTextField
                  item={item.usageType} />
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