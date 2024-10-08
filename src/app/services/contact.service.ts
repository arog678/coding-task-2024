import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import { Contact } from '../models/contact.model';
import { MatDialog } from '@angular/material/dialog';
import { ContactEditDialogComponent } from '../dialogs/contact-edit-dialog/contact-edit-dialog.component';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  mockList : Contact[] =  [
    {
      id: 1,
      firstName : "Jim",
      lastName : "Jimson",
      phoneNumber: "",
      email : "",
    },
    {
      id: 2,
      firstName : "Jack",
      lastName : "Jackson",
      phoneNumber: "",
      email : "",
    }
  ]


  constructor(
    private dialog : MatDialog
  ) { }


  //#region mock back end calls

  getContactList$() : Observable<Contact[]> {
  
    // Q3
    const showErrors = false;
    return showErrors && _.random(0,10) > 5 
      ? throwError(() => {return new Error('FAILED TO GET LIST')} )
      : of(this.mockList).pipe(
       delay(2000),
    )

  }

  saveContact$(contact: Contact): Observable<Contact> {
    // Find the index of the contact in the list
    let index = _.findIndex(this.mockList, (c) => c.id === contact.id);
  
    if (index === -1) {
      // If the contact doesn't exist, add it
      const newContact = { ...contact, id: this.getNextId() };
      this.mockList = [...this.mockList, newContact];

      return of(newContact);
    } else {
      // If the contact exists, replace it with a new object
      this.mockList = [
        ...this.mockList.slice(0, index),
        contact,
        ...this.mockList.slice(index + 1)
      ];
      return of(contact);
    }
  
  }
  

  private getNextId(): number {
    // Calculate the next ID based on the current highest ID
    return this.mockList.length > 0 ? Math.max(...this.mockList.map(c => c.id)) + 1 : 1;
  }

  //#endregion

  editContactDialog$(contact: Contact) : Observable<Contact> {

    const dialogRef = this.dialog.open(ContactEditDialogComponent, {
      data: {
        contact
      }
    })

    return dialogRef.afterClosed();

  }

  createContactDialog$() : Observable<Contact> {
    
    const dialogRef = this.dialog.open(ContactEditDialogComponent, {
      data: {
        contact: null
      }
    })

    return dialogRef.afterClosed();
  }


}
