import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {
  todoForm! : FormGroup;
  private firestore: FirebaseTSFirestore;
  onCreateClick(taskId: HTMLInputElement, taskName: HTMLInputElement, taskStatus: HTMLSelectElement){
    let id = taskId.value;
    let name = taskName.value;
    let status = taskStatus.value;
    this.router.navigateByUrl('/dashboard');
    this.firestore = new FirebaseTSFirestore();
    this.firestore.create(
      {
        path: ['TaskCollection'],
        data: {
          taskId: id,
          taskName: name,
          taskStatus: status,
          timestamp: FirebaseTSApp.getFirestoreTimestamp(),
        },
        onComplete: () => {
          alert("Data recorded!");
          this.dialog.close();
          this.router.navigate(['/dashboard']);
        },
        onFail: (err) => {
          alert(err.message);
        },
      }
    );
  }
  onCloseClick(){
    this.dialog.close();
  }
  constructor(private dialog: MatDialogRef<CreateTaskComponent>, private router: Router, private fb : FormBuilder) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false; 
    };
  }
  ngOnInit(): void {
    this.todoForm = this.fb.group({
      item : ['',Validators.required]
    })
  }
}
