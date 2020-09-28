# row-board-task
row-board-task is a multi-row kanban board application.

## Features
- Rows contain a list of boards, which contain a list of tasks
- Tasks can be marked complete, marked with icon tags or text labels, given a due date, linked to other tasks
- Card background and font color can be customized
- Can attach display photos and files to tasks
- Can export+import application state from JSON

## Built with
- Database: MongoDB Atlas v4.2.9
- Backend: Node v10.15.3 with NestJS v7.0.0. Authentication provided using Amazon Cognito.
- Frontend: Angular v8.0.0

## Selfhosting
A guide to selfhosting this application can be found [here](#).

## Future Development
- Allow multiple projects + collaboration
- Implement search functionality
- Fix Firefox redirect bug
- Implement a more effecient save strategy than overwriting the entire app state
- Major code cleanup needed on the frontend