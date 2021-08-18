import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { StateService } from './state.service';

// resolver to pass user information for upgrade page

@Injectable({
  providedIn: 'root'
})
export class UpgradeResolver implements Resolve<boolean> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return of(this.state.userProps);
  }

  constructor(private state: StateService) {

  }
}
