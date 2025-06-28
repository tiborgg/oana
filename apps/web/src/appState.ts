import { action, makeObservable } from 'mobx';

export class AppState {

  constructor() {
    makeObservable(this);
  }

  @action
  mounted() {

  }

  @action
  unmounted() {

  }
}