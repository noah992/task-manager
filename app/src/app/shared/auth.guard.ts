import { Injectable, OnInit } from '@angular/core';
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

      if (route.url) {
        if (route.url.find(item => item.path == 'admin')) {
          return this.userProps.username == 'admin' ? true : false
        } else if (route.url.find(item => item.path == 'user')) {
          return this.userProps.username ? true : false
        } else {
          return true
        }
      } else {
        return this.userProps.username ? false : true
      }
  }

  constructor(private state: StateService) {
    this.userProps = state.userProps
    state.updateUserProps.subscribe(data => {
      this.userProps = data
    })
  }
  
}
