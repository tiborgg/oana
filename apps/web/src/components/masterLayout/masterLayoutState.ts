import { action, makeObservable, observable } from 'mobx';

export class MasterLayoutState {

  constructor() {
    makeObservable(this);
  }

  @observable.ref accessor isSidebarOpen = true;

  @action
  mounted() {
    
  }

  @action
  unmounted() {
    
  }

  @action.bound
  handleSidebarOpenChange(open: boolean) {
    this.isSidebarOpen = open;
  }
}