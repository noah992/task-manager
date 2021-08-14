import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanComponent } from './plan/plan.component';
import { RouterModule } from '@angular/router';
import { PaymentComponent } from './payment/payment.component';
import { UpgradeResolver } from '../../shared/upgrade.resolver';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { UpgradeGuard } from 'src/app/shared/upgrade.guard';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { UpgradeDirective } from 'src/app/shared/upgrade.directive';
import { DialogComponent } from './dialog/dialog.component';


@NgModule({
  declarations: [
    PaymentComponent,
    PlanComponent,
    UpgradeDirective,
    DialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: PlanComponent },
      { path: ':plan', component: PaymentComponent, resolve:{data:UpgradeResolver}, canDeactivate: [UpgradeGuard] }
    ]),
    RouterModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {}}
  ]
})
export class UpgradeModule { }
