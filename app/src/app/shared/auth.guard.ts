import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StateService } from './state.service';

// guest user can acccess only login and home page

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  userProps:any

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if (state.url.includes('admin-console')) return this.userProps.isAdmin ? true : false
      if (state.url.includes('task')) return this.userProps.claim[route.data.claimType] ? true : false
      if (state.url.includes('user')) return this.userProps.username ? true : false
      return true
  }

  constructor(private state: StateService) {
    this.userProps = state.userProps
    state.updateUserProps.subscribe(data => {
      this.userProps = data
    })
  }
  
}
