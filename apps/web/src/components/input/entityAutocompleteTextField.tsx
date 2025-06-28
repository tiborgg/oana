import { observer } from 'mobx-react-lite';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Button } from '../ui/button';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '../ui/command';
import { ChevronsUpDown } from 'lucide-react';
import { EntityAutocompleteTextFieldProxy } from './entityAutocompleteTextFieldProxy';

type Props = {
  item: EntityAutocompleteTextFieldProxy;
}

export const ProductListItemAutocompleteTextField = observer(({ item }: Props) => {

  if (item.isEditing) {
    return (
      <Popover
        open={item.isSuggestionPopoverOpened}
        onOpenChange={item.handleSuggestionPopoverOpenChange}>

        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="justify-between w-full overflow-hidden whitespace-nowrap text-ellipsis">
            {item.value ?? 'Select...'}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0">
          <Command>
            <CommandInput
              placeholder="Search framework..."
              className="h-9"
              onChangeCapture={item.handleSuggestionFilterChange} />

            <CommandList>
              <CommandEmpty>
                No item found.
              </CommandEmpty>

              <CommandGroup>
                {item.resolvedSuggestions?.map((suggestion, index) => (
                  <CommandItem
                    key={index}
                    onSelect={item.handleSuggestionSelect}>
                    {suggestion}
                  </CommandItem>
                ))}

                {item.isSuggestionFilterNew && (
                  <CommandItem
                    key={item.suggestionFilterKey}
                    onSelect={item.handleSuggestionSelect}>
                    {item.suggestionFilter}
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="px-[calc(0.75rem+1px)]">{item.value}</div>
  );
});