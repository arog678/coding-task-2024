import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromContacts from './reducer';


export const selectContactsState = createFeatureSelector<fromContacts.State>('contacts');

export const selectContactList = createSelector(
    selectContactsState,
    state => state.contactList
);

export const selectActiveContactId = createSelector(
    selectContactsState,
    state => state.selectedContactId
)

export const selectActiveContact = createSelector(
    selectContactList,
    selectActiveContactId,
    (list, id) => list.find( contact => contact.id === id)
)

// Q3
export const selectErrorMsg = createSelector(
    selectContactsState,
    state => state.errorMsg
)