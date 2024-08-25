# CodingTask2024

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.1.

# Introduction
This repo contains a simple angular / ngrx project. The project consists of:
* Components - 
    The main structural elements of the app, this includes "Smart" components that interact with the store, and "Dumb" componenets that are only aware of their inputs and outputs.
* Dialogs - 
    Special componenets that make use of the Mat Dialog CDK, these are used for "User Input" effects.
* Models - 
    Define the shape of the data the app uses. (In our main codebase, this is where we would define out Zod schemas, for simplicity here we have just provided a simple type)
* Services - 
    The services are where we orchestrate interacting with the back end to perform CRUD operations, in this example we have provided some mock data and functions.
    This is also where we provide functions that launch the dialogs.
* State -
    The state folder contains the NGRX componenets for managing state.

In our main code base, you would expect to find this architecture replicated within each feature module that makes up the app. For simplicity here, we have included everything inside the app module.

# Your Mission
1. In the mock service, we have introduced an exaggerated delay when loading the contact list to simulate loading a larger data set into state. Extend the component, with the help of angular directives, to show a loading message when the contact list is empty.
2. We have the functionality to edit existing contacts, now add an "Add Contact" button to the contact list with the appropriate actions and effects. You should be able to re-use the contact-edit-dialog.
3. The effects deal with external interactions, as such there is no guarantee that they won't recieve an error response. How could we handle the case where a service function throws an error? You don't need to write any code for this one just, explain what you would change/add, optionally include an example snippet. (hint: rxjs provides an operator for this)
4. We have provided a Role type in the contact.model.ts file, assume a contact can be associated with one or many projects, and can have a different role on each. Explain with the help of diagrams what the interface for managing a contact's roles might look like and list the steps you would take to implement that feature. No code is required for this question, you can choose how you present this, either include it as a PDF in your repo, or provide a public link to a SAAS such as figma or whimsical.

# Answers

1. The code will look to see if the list is empty.
2. Add contact works however adding multiple will overwrite the last item. This makes sense as the system is designed to pull from a server (mockList) and to make the task is to send requests to the system. Adding in a system to mock update the BE is beyond scope.
3. 
    When sending a request it is important we properly handle the reponse. We may want to display info in the FE to keep the users aware of whats happening and prehaps fallbacks we can use if the data is not required. When an error is given how is best to handle it?

    Sometimes data may not be critical to first page load, We may want to have those calls retry. It may be acceptable to load these asynconously. Certain data you will want to laod in right away. In these cases a message to the users that there is an issue in the fe may be required.

    If an error is given it may be critical and the page must be reloaded. In other cases it may be ignored if not critical to functionality.

    Here is an example of how it would be handled by the app:

    action.ts:
    ...
    //Setup the action for error here
    export const contactListError = createAction(
        '[BACKEND SERVICE] Contact List Error',
        props<{errorMessage: string}>()
    );
    ...

    reducer.ts:
    ...
    //when action dispatched the state of error message is set here
    on(actions.contactListError, (state, action) => ({
        ...state,
        errorMessage : action.errorMessage
    }))
    ...

    effects.ts
    ...
    retrieveContactList$ = createEffect(()=> this.actions$.pipe(
        ofType(actions.appStarted),
        concatMap(() => 
            this.contactService.getContactList$().pipe(
                map(contactList => actions.contactListReturned({contactList})),
                //Errors caught here will dispatch a contactListError action
                catchError(error => of(actions.contactListError({ errorMessage: error.message })))
            )
        )
    ))
    ...
    
4. ./Angular Interface.pdf