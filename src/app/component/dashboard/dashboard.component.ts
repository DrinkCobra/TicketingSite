import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FirebaseTSFirestore, OrderBy, Limit } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { stringLength } from '@firebase/util';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  firestore = new FirebaseTSFirestore();
  toDo: TicketData [] = [];
  inProg: TicketData [] = [];
  reOpen: TicketData [] = [];
  reSolve: TicketData [] = [];
  holdPass: TicketData [] = [];
  blockTest: TicketData [] = [];
  readyTest: TicketData [] = [];
  testProg: TicketData [] = [];
  readyProd: TicketData [] = [];
  rollBack: TicketData [] = [];
  deployed: TicketData [] = [];
  constructor(private router: Router, private dialog: MatDialog, private afAuth: AngularFireAuth, private auth : AuthService){
  }
  ngOnInit(): void {
    this.getPosts();
  }
  logout() {
    this.auth.logout();
  }
  onCreateTaskClick() {
    this.dialog.open(CreateTaskComponent);
  }
  getPosts(){
    this.firestore.getCollection(
      {
        path: ['TaskCollection'],
        where: [
          new OrderBy('timestamp','desc'),
          new Limit(20),
        ],
        onComplete:(result) => {
          result.docs.forEach(
            doc => {
              let ticket = <TicketData>doc.data();
              ticket.id = doc.id;
              switch (ticket.taskStatus) {
                case 'To Do':
                    this.toDo.push(ticket);
                    break;
                case 'In Progress':
                    this.inProg.push(ticket);
                    break;
                case 'Reopen':
                    this.reOpen.push(ticket);
                    break;
                case 'Resolved':
                    this.reSolve.push(ticket);
                    break;
                case 'Hold Passed':
                    this.holdPass.push(ticket);
                    break;
                case 'Blocked Testing':
                    this.blockTest.push(ticket);
                    break;
                case 'Ready for Testing':
                    this.readyTest.push(ticket);
                    break;
                case 'Test in Progress':
                    this.testProg.push(ticket);
                    break;
                case 'Ready for Production':
                    this.readyProd.push(ticket);
                    break;
                case 'Rollback':
                    this.rollBack.push(ticket);
                    break;
                case 'Deployed':
                    this.deployed.push(ticket);
                    break;
                default:
                    break;
                }
            }
          );
        },
        onFail: err => {

        }
      }
    );
  }
  drop(event: CdkDragDrop<TicketData[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      console.log(event.container.data[event.currentIndex]['id'])
      this.firestore.update(
        {
          path: ['TaskCollection',event.container.data[event.currentIndex]['id']],
          data: {
            taskStatus: event.container.id
          },
          onComplete: (docref) => {
            console.log("Successful Update")
          },
          onFail: (err) => {
            console.log("Failed Update")
          },
        }
      )
    }
  }
}
export interface TicketData {
  id: string;
  taskId: string;
  taskName: string;
  taskStatus: string;
  timestamp: string;
}
