import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PaymentComponent } from '../component/upgrade/payment/payment.component';

// when user leaves with filled information but not submitted in upgrade page

@Injectable({
  providedIn: 'root'
})
export class UpgradeGuard implements CanDeactivate<PaymentComponent> {
  canDeactivate(
    component: PaymentComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const forms = component.form.value
      if (component.confirmationPage) return true
      for (let item in forms) {
        if (forms[item]) return confirm("Are you sure you want to leave this page?")
      }
      return true;
  }
  
}
