import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StateService } from 'src/app/shared/state.service';
import { PaymentComponent } from '../payment/payment.component';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PaymentComponent>, @Inject(MAT_DIALOG_DATA) public data: any, ) { }

  ngOnInit(): void {
  }

  //close dialog
  closeDialog(): void {
    this.dialogRef.close(true);
  }

}
