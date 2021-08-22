import { HttpClient } from '@angular/common/http';
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
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.state.userInfo
  }

  constructor(private state: StateService) {

  }
}
