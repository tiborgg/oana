import { action, computed, makeObservable, observable } from 'mobx';
import { IEntityProxy } from './entityInputSchema';

export type EntityAutocompleteTextFieldSuggestions = 
  string[] | 
  (() => string[]);

type EntityAutocompleteTextFieldProxyProps = {
  parent: IEntityProxy;
  value?: string | null;
  initialValue?: string | null;
  suggestions?: EntityAutocompleteTextFieldSuggestions;
}

export class EntityAutocompleteTextFieldProxy {

  constructor(
    props: EntityAutocompleteTextFieldProxyProps) {
    makeObservable(this);

    this.parent = props.parent;
    this.value = props.value ?? null;
    this.initialValue = 'initialValue' in props ?
      (props.initialValue ?? null) :
      (props.value ?? null);
      
    this.suggestions = props.suggestions ?? null;
  }

  readonly parent: IEntityProxy;

  @observable.ref accessor initialValue: string | null;
  @observable.ref accessor value: string | null;

  @observable.ref accessor suggestions: EntityAutocompleteTextFieldSuggestions | null;

  @computed get resolvedSuggestions() {
    return typeof this.suggestions === 'function' ? 
      this.suggestions() : 
      this.suggestions;
  }

  @computed get resolvedSuggestionKeys() {
    return new Set(this.resolvedSuggestions?.map(suggestion => suggestion.toLowerCase().trim()) ?? []);
  }

  @observable.ref accessor suggestionFilter: string | null = null;
  @observable.ref accessor isSuggestionPopoverOpened: boolean = false;

  @computed get suggestionFilterKey() {
    return this.suggestionFilter?.toLowerCase().trim() ?? '';
  }

  @computed get isSuggestionFilterNew() {
    const value = this.suggestionFilter && !this.resolvedSuggestionKeys.has(this.suggestionFilterKey);
    console.log(value);
    return value;
  }

  @computed get isEditing() {
    return this.parent.isEditing;
  }

  @computed get isDirty() {
    return this.initialValue !== this.value;
  }

  @action
  reset() {
    this.value = this.initialValue;
  }
  
  @action
  handleSuggestionFilterChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.suggestionFilter = evt.target.value;
  }

  @action
  handleSuggestionSelect = (value: string) => {
    this.value = value;
    this.isSuggestionPopoverOpened = false;
  }

  @action
  handleSuggestionPopoverOpenChange = (value: boolean) => {
    this.isSuggestionPopoverOpened = value;
  }
}