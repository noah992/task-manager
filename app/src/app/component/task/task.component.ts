import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { StateService } from 'src/app/shared/state.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, OnDestroy {

  task:any = {
    completed:false,
    incompleted:false,
  } // task list
  updateTask = new Subject() // streamer for task
  userProps:any // user properties
  newTask:any // new task
  formTask:any // form group to edit task
  idToEdit:any // store task id to update


  //  crate new task
  addTask(e:any) {
    if (e.key == 'Enter') {
      this.http.post(this.state.apiUrl+'tasks', { title: this.newTask.value, id:this.state.userProps.id}).subscribe((data: any) => {
        this.task.incompleted = [data, ...this.task.incompleted]
        this.newTask.setValue('')
      })
    }
  }

  // update when task completed
  completeTask(id:any) {
    console.log(id)
    this.http.post(this.state.apiUrl+'tasks/completed', { id: id }).subscribe((data: any) => {
      this.task = {
        completed:[this.task.incompleted.find((item:any) => item.id == data.id), ...this.task.completed],
        incompleted:this.task.incompleted.filter((item:any) => item.id !== data.id),
      }
    })
  }

  // edit task details
  editTask() {
    const content = {
      title: this.formTask.get('title').value,
      createdDate: this.formTask.get('createdDate').value,
      dueDate: this.formTask.get('dueDate').value,
      contact: this.formTask.get('contact').value,
      location: this.formTask.get('location').value,
      description: this.formTask.get('description').value,
    }
    this.http.post(this.state.apiUrl+'tasks/editTask', {id:this.idToEdit, content:content}).subscribe((data:any) => {
      this._snackBar.open('Your task has been successfully updated', 'Close', { duration: 2000 })
      this.task.incompleted = this.task.incompleted.map((item:any) => {
        if (item.id == data.id) {
          return data
        } else {
          return item
        }
      })
    })
  }

  // delete a task
  deleteTask(id:number) {
    this.http.delete(this.state.apiUrl+'tasks', { body: { id: id } }).subscribe((data:any) => {
      this.task = data
      this.task = this.task.sort((a:any, b:any) => b.id - a.id)
      this.task = {
        completed:this.task.filter((item:any) => item.completed == true),
        incompleted:this.task.filter((item:any) => item.completed == false),
      }
    })
  }

  // activate edit page for a task
  generateEditTask(task:any) {
    const { id, title, contact, createdDate, description, dueDate, location } = task
    this.formTask.controls.title.setValue(title)
    this.formTask.controls.contact.setValue(contact)
    this.formTask.controls.createdDate.setValue(createdDate)
    this.formTask.controls.description.setValue(description)
    this.formTask.controls.dueDate.setValue(dueDate)
    this.formTask.controls.location.setValue(location)
    this.idToEdit = id
  }

  convertMonthDate(time:any) {
    return ('0' + time.split("?")[0].split(':')[0]).slice(-2) + ':' + ('0' + time.split("?")[0].split(':')[1]).slice(-2) + ' ' + time.split("?")[1].split('/')[1] + '/' + time.split("?")[1].split('/')[0]+ '/' + time.split("?")[1].split('/')[2]
  }

  constructor(private http: HttpClient, private fb: FormBuilder, private _snackBar: MatSnackBar, private state: StateService) {
    
  }
 
  ngOnInit(): void {
    this.newTask = new FormControl()
    this.http.get(this.state.apiUrl+'tasks').subscribe((data:any) => {
      this.task = data
      this.task = this.task.sort((a:any, b:any) => b.id - a.id)
      this.task = {
        completed:this.task.filter((item:any) => item.completed == true),
        incompleted:this.task.filter((item:any) => item.completed == false),
      }
    })
    this.formTask = this.fb.group({
      title: [''],
      createdDate: [''],
      dueDate: [''],
      contact: [''],
      location: [''],
      description: [''],
    })
    this.updateTask.subscribe(data => {
      this.task = data
    })
    this.state.updateUserProps.subscribe(data => {
      this.userProps = data
    })
  }

  ngOnDestroy() {
    this.updateTask.unsubscribe()
  }

}
