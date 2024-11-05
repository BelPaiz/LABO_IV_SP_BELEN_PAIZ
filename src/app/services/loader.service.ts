import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loading: boolean = false;
  constructor() { }
  setLoader(loading: boolean) {
    if (!loading) {
      setTimeout(() => { this.loading = loading; }, 500);
    }
    else {
      this.loading = loading;
    }
  }

  getLoader(): boolean {
    return this.loading;
  }
}
