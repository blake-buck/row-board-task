import {getState, addRow, editRowDescription, addBoard, transferBoard, editBoardTitle, archiveBoard, deleteBoard, toggleHideCompleteTasks, addTask, editTask, deleteTask, transferTaskEmpty, transferTask, linkTask, saveChanges, editRowExpanded, openTaskDialog, setSelectedTask, closeTaskDialog, shiftRowUp, shiftRowDown, deleteRow, archiveRow, archiveTask, restoreArchivedRow, restoreArchivedBoard, restoreArchivedTask, setState, loginSuccess, forgotPassword, retrieveStateFromDbSuccess, editRowTitle} from './app.actions';
import {initialState } from './app.state';
import { _addTask, _editTask, _deleteTask, _transferTaskEmpty, _transferTask, _linkTask, _archiveTask, _restoreArchivedTask } from './reducer-helpers/task.helpers';
import { _addBoard, _transferBoard, _editBoardTitle, _archiveBoard, _deleteBoard, _reorderBoardTasks, _toggleHideCompleteTasks, _restoreArchivedBoard } from './reducer-helpers/board.helpers';
import { _addRow, _editRowDescription, _editRowExpanded, _shiftRowUp, _shiftRowDown, _deleteRow, _archiveRow, _restoreArchivedRow, _editRowTitle } from './reducer-helpers/row.helpers';

export function appReducer(state=initialState, action){
    switch(action.type){

        case getState.type:
            return state;
        
        case setState.type:
            return action.state.appReducer;

        case addRow.type:
            return _addRow(state);
        
        case archiveRow.type:
            return _archiveRow(state, action);
        
        case restoreArchivedRow.type:
            return _restoreArchivedRow(state, action);

        case editRowTitle.type:
            return _editRowTitle(state, action);
        
        case editRowDescription.type:
            return _editRowDescription(state, action);

        case editRowExpanded.type:
            return _editRowExpanded(state, action);

        case shiftRowUp.type:
            return _shiftRowUp(state, action);
        
        case shiftRowDown.type:
            return _shiftRowDown(state, action);

        case deleteRow.type:
            return _deleteRow(state, action);

        case addBoard.type:  
            return _addBoard(state, action);

        case transferBoard.type:
            return _transferBoard(state, action);

        case editBoardTitle.type:
            return _editBoardTitle(state, action);

        case archiveBoard.type:
            return _archiveBoard(state, action);

        case restoreArchivedBoard.type:
            return _restoreArchivedBoard(state, action);

        case deleteBoard.type:
            return _deleteBoard(state, action);
        
        case "REORDER_BOARD_TASKS":
            return _reorderBoardTasks(state, action);

        case toggleHideCompleteTasks.type:
            return _toggleHideCompleteTasks(state, action);
            
        case addTask.type:
            return _addTask(state, action);

        case editTask.type:
            return _editTask(state, action);
            
        case deleteTask.type:
            return _deleteTask(state, action);

        case archiveTask.type:
            return _archiveTask(state, action);

        case restoreArchivedTask.type:
            return _restoreArchivedTask(state, action);
        
        case transferTaskEmpty.type:
            return _transferTaskEmpty(state, action);
            
        case transferTask.type:
            return _transferTask(state, action);
        
        case linkTask.type:
            return _linkTask(state, action);

        case saveChanges.type:
            return {
                ...state,
                isDataSaved:true
            }

        case openTaskDialog.type:
            return {
                ...state,
                isTaskDialogOpen:true
            }
        
        case closeTaskDialog.type:
            return {
                ...state, 
                isTaskDialogOpen:false
            }
            
        case setSelectedTask.type:
            return {
                ...state,
                selectedTask: action.task
            }

        case forgotPassword.type:
            return {
                ...state,
                userEmail: action.formValue.username
            }

        case retrieveStateFromDbSuccess.type:
            return {
                ...state,
                ...action.storedState,
                isStateLoading:false,
                isStateRetrieved:true
            }
        
        default:
            return state;
       
    }
}