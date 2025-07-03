import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EntityNumberField } from '@/components/input/entityNumberField';
import { ReportPageState } from './reportPageState';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const months = [
  "Ianuarie",
  "Februarie",
  "Martie",
  "Aprilie",
  "Mai",
  "Iunie",
  "Iulie",
  "August",
  "Septembrie",
  "Octombrie",
  "Noiembrie",
  "Decembrie"
]

export const ReportPage = observer(() => {

  const params = useParams();
  const [model] = useState(() => new ReportPageState());

  useEffect(() => {
    model.mounted(params);
    return () =>
      model.unmounted();
  }, [model, params]);

  if (!model.report && !model.isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-white">
        <h3 className="text-xl font-bold mb-4 text-center text-gray-600 grid">
          Raportul pentru {months[model.monthParam ?? -1]} {model.yearParam} nu a fost creat
        </h3>

        <Button
          variant="default"
          size="lg"
          onClick={model.handleCreateReportButtonClick}>
          Creează acum
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-background sticky top-0 grid grid-cols-2 h-16 shrink-0 items-center gap-2 border-b px-4">
        <div>
          <h3 className="font-bold text-xl">
            Raport {months[model.monthParam ?? -1]} {params.year}
          </h3>
        </div>

        <div className="flex justify-end gap-2">

          <Input
            value={model.searchQuery ?? ''}
            onChange={(e) => model.searchQuery = e.target.value}
            placeholder="Caută..."
            className="w-64"
            type="text" />

          <Button
            variant="default"
            onClick={model.handleSaveButtonClick}>
            Salvează
          </Button>

          <Button
            variant="outline"
            onClick={model.handleResetButtonClick}>
            Resetează
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4 w-12">Nr. Crt.</TableHead>
            <TableHead>Denumire</TableHead>
            <TableHead>U.M.</TableHead>
            <TableHead>Stoc luna precedenta</TableHead>
            <TableHead>Intrari an</TableHead>
            <TableHead>Intrari luna</TableHead>
            <TableHead>Iesiri luna</TableHead>
            <TableHead>Stoc final luna</TableHead>
            <TableHead>Mod de ambalare</TableHead>
            <TableHead>Mod de depozitare</TableHead>
            <TableHead>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full cursor-pointer text-left">Tip</button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filtrare</DropdownMenuLabel>

                  <DropdownMenuCheckboxItem
                    checked={model.usageTypeFilter.size === 0}
                    onCheckedChange={(checked) => model.usageTypeFilter.clear()}
                    onSelect={(evt) => evt.preventDefault()}>
                    Toate
                  </DropdownMenuCheckboxItem>

                  {model.usageTypes.map((usageType, index) => (
                    <DropdownMenuCheckboxItem
                      key={index}
                      checked={model.usageTypeFilter.has(usageType)}
                      onCheckedChange={(checked) => model.handleUsageTypeFilterItemToggle(usageType, checked)}
                      onSelect={(evt) => evt.preventDefault()}>
                      {usageType}
                    </DropdownMenuCheckboxItem>
                  ))}

                  <DropdownMenuSeparator />

                  <DropdownMenuLabel>Grupare</DropdownMenuLabel>
                  
                  <DropdownMenuCheckboxItem
                    checked={model.usageTypeFilter.size === 0}
                    onCheckedChange={(checked) => model.usageTypeFilter.clear()}
                    onSelect={(evt) => evt.preventDefault()}>
                    Grupează
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {model.displayReportItemProxies.map((item, index) => (
            <TableRow
              key={item.productId}
              className={[
                item.isPending ? 'text-gray-500' : '',
                item.isDirty ? 'bg-yellow-100 hover:bg-yellow-200' : '',
                item.isDeleted ? 'bg-red-100 hover:bg-red-200' : ''
              ].join(' ')}
              onDoubleClick={() => item.setEditing(!item.isEditing)}>

              <TableCell className="pl-4">{index + 1}</TableCell>
              <TableCell className="font-medium">{item.product?.name}</TableCell>
              <TableCell className="font-medium">{item.product?.unit}</TableCell>
              <TableCell>{item.inInventory}</TableCell>
              <TableCell>{
                (item.yearInQuantity ?? 0) +
                (item.inQuantityProxy.value ?? 0) -
                (item.inQuantityProxy.initialValue ?? 0)
              }</TableCell>
              <TableCell className="py-1">
                <Input
                  value={item.inQuantityProxy.value ?? ''}
                  onChange={(e) => item.inQuantityProxy.value = Number(e.target.value)}
                  className="w-32"
                  type="number" />
              </TableCell>
              <TableCell className="py-1">
                <Input
                  value={item.outQuantityProxy.value ?? ''}
                  onChange={(e) => item.outQuantityProxy.value = Number(e.target.value)}
                  className="w-32"
                  type="number" />
              </TableCell>
              <TableCell>{item.outInventory}</TableCell>
              <TableCell>{item.product?.packagingType}</TableCell>
              <TableCell>{item.product?.storageType}</TableCell>
              <TableCell>{item.product?.usageType}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        
        <TableFooter>
          <TableRow>
            <TableCell colSpan={7} className="text-right">
              <Button
                variant="default"
                onClick={model.handleSaveButtonClick}>
                Salvează
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

    </div>
  )
});