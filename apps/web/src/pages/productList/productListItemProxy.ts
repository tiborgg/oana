import { EntityAutocompleteTextFieldSuggestions } from '@/components/input/entityAutocompleteTextFieldProxy';
import { Product } from '@repo/graphql';
import { action, computed, makeObservable, observable } from 'mobx';
import { EntityTextFieldProxy } from '@/components/input/entityTextFieldProxy';
import { EntityAutocompleteTextFieldProxy } from '@/components/input/entityAutocompleteTextFieldProxy';

type ProductListItemProxyProps = {
  source: Product | null;
  isDraft?: boolean | null;
  packagingTypeSuggestions: EntityAutocompleteTextFieldSuggestions;
  storageTypeSuggestions: EntityAutocompleteTextFieldSuggestions;
  usageTypeSuggestions: EntityAutocompleteTextFieldSuggestions;
}

export class ProductListItemProxy {

  constructor(
    private readonly props: ProductListItemProxyProps) {
    makeObservable(this);

    const { source } = this.props;

    this.isDraft = props.isDraft ?? false;
    
    this.name = new EntityTextFieldProxy({
      parent: this,
      value: source?.name ?? null
    });

    this.packagingType = new EntityAutocompleteTextFieldProxy({
      parent: this,
      value: source?.packagingType ?? null,
      suggestions: props.packagingTypeSuggestions
    });

    this.storageType = new EntityAutocompleteTextFieldProxy({
      parent: this,
      value: source?.storageType ?? null,
      suggestions: props.storageTypeSuggestions
    });

    this.usageType = new EntityAutocompleteTextFieldProxy({
      parent: this,
      value: source?.usageType ?? null,
      suggestions: props.usageTypeSuggestions
    });

    this.legalNumber = new EntityTextFieldProxy({
      parent: this,
      value: source?.legalNumber ?? null
    });

    this.observations = new EntityTextFieldProxy({
      parent: this,
      value: source?.observations ?? null
    });
  }

  get source() {
    return this.props.source ?? null;
  }

  get id() {
    return this.source?.id ?? null;
  }

  readonly name: EntityTextFieldProxy;
  readonly packagingType: EntityAutocompleteTextFieldProxy;
  readonly storageType: EntityAutocompleteTextFieldProxy;
  readonly usageType: EntityAutocompleteTextFieldProxy;
  readonly legalNumber: EntityTextFieldProxy;
  readonly observations: EntityTextFieldProxy;

  readonly isDraft: boolean = false;
  @observable.ref accessor isEditing: boolean = false;
  @observable.ref accessor isDeleted: boolean = false;

  @action
  setEditing(value: boolean) {
    this.isEditing = value;
  }

  @action
  setDeleted(value: boolean) {
    this.isDeleted = value;
  }

  @computed get isDirty() {
    return (
      this.name.isDirty ||
      this.packagingType.isDirty ||
      this.storageType.isDirty ||
      this.usageType.isDirty ||
      this.legalNumber.isDirty ||
      this.observations.isDirty
    );
  }
}