import { Component, OnInit,} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { StateService } from 'src/app/shared/state.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  form:any //form for payment information
  confirmationPage:any //deactivate runs when false
  confirmed:any //true after confirme dialog

  constructor(
    public route: ActivatedRoute, private fb: FormBuilder, public dialog: MatDialog, 
    private router: Router, private state: StateService, private http: HttpClient) {
      this.confirmed = false
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      firstname: ['',],
      lastname: ['', ],
      email: ['', ],
      phone: ['', ],
      country: ['', ],
      zip: ['', ],
      state: ['', ],
      addressFirst: ['', ],
      credit:['']
    })

    this.route.data.subscribe(data => {
      this.form.get('firstname').value = data.data.fname[0].toUpperCase() + data.data.fname.slice(1)
      this.form.get('lastname').value = data.data.lname[0].toUpperCase() + data.data.lname.slice(1)
      this.form.get('email').value = data.data.email[0].toUpperCase() + data.data.email.slice(1)
    })

  }

  //open confirmation dialog
  openDialog(plan:string) {
    this.confirmationPage = true
    const confirmationInfo = []
    for (let item in this.form.value) {
      confirmationInfo.push({ label: item, value: this.form.controls[item].value })
    }
    const dialogRef = this.dialog.open(DialogComponent, {
      data:confirmationInfo
    })
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.http.post('http://localhost:3000/users/edit/'+this.route.snapshot.params.plan, { id: localStorage.getItem('userId'), }).subscribe((data:any) => {
          this.router.navigate(['user', this.state.activeUser, 'task'])
          this.state.userNav()
          localStorage.setItem('plan', data.plan)
          this.state.checkPlan()
        })
      }
    })
  }

  //add optional address line
  generateForm() {
    this.form.addControl('addressSecond', this.fb.control(''))
  }

}