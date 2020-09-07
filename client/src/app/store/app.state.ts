import { isNumber, isString, isBoolean, isNull, isOneOf, hasShape, isArrayOf } from '../../../../shared/verification';
import { Row, Board, Task } from '../../../../shared/types';
import { rowTypes, boardTypes, taskTypes } from '../../../../shared/type-verifiers';

export interface AppState{
    userEmail:string;

    partitionKey:string;
    currentTaskKey:number,
    currentBoardKey:number,
    currentRowKey:number,
    archivedRows:Row[],
    rows:Row[],
    archivedBoards:Board[],
    archivedTasks:Task[],
    boards:Board[],
    selectedTask:Task | null;

    isDataSaved:boolean;
    isDataSaving:boolean;
    isTaskDialogOpen:boolean;

    isStateRetrieved:boolean;
    isStateLoading:boolean;

    rowCount:number;
    boardCount:number;
    taskCount:number;
}

export type AppStore = {appReducer: AppState};

export const appStateTypes = {
    partitionKey: isString,
    currentTaskKey: isNumber,
    currentBoardKey: isNumber,
    currentRowKey: isNumber,

    archivedRows: isArrayOf(hasShape(rowTypes)),
    rows: isArrayOf(hasShape(rowTypes)),

    archivedBoards: isArrayOf(hasShape(boardTypes)),
    archivedTasks: isArrayOf(hasShape(taskTypes)),
    selectedTask: isOneOf(isNull, hasShape(taskTypes)),
    boards: isArrayOf(hasShape(boardTypes)),

    isDataSaved: isBoolean,
    isDataSaving: isBoolean,
    isTaskDialogOpen: isBoolean,

    isStateRetrieved: isBoolean,
    isStateLoading: isBoolean,

    rowCount:isNumber,
    boardCount:isNumber,
    taskCount:isNumber
}

export const initialState:AppState = {
    userEmail:'',
    
    partitionKey:'state',
    currentTaskKey:1,
    currentBoardKey:1,
    currentRowKey:1,
    archivedRows:[],
    rows:[],
    archivedBoards:[],
    archivedTasks:[],
    boards:[],
    isDataSaved:true,
    isDataSaving:false,
    isTaskDialogOpen:false,

    isStateRetrieved: false,
    isStateLoading: true,

    selectedTask:null,
    rowCount:0,
    boardCount:0,
    taskCount:0
}