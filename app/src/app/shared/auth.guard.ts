import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      if (route.url) {
        if (route.url.find(item => item.path == 'admin')) {
          return this.state.activeUser == 'admin' ? true : false
        } else if (route.url.find(item => item.path == 'user')) {
          return this.state.activeUser ? true : false
        } else {
          return true
        }
        // if (route.url.length > 1 && route.url[1].path == 'admin') {
        //   return localStorage.getItem('loggedInAs') == 'admin' ? true : false
        // } else if (route.url.length > 1 && route.url[1].path !== 'admin') {
        //   return localStorage.getItem('loggedInAs') ? true : false
        // } else if (route.url[0].path == 'user') {
        //   return localStorage.getItem('loggedInAs') ? true : false
        // } else {
        //   return true
        // }
      } else {
        return this.state.activeUser ? false : true
      }
  }

  constructor(private state: StateService) {

  }
  
}
