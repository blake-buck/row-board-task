import * as moment from 'moment'

export function _addTask(state, action){
    return{
        ...state,
        isDataSaved:false,
        currentTaskKey:state.currentTaskKey + 1,
        boards:state.boards.map(board => {
            if(board.key === action.key){
                return {
                    ...board,
                    
                    tasks:[
                        {
                            key:state.currentTaskKey, boardKey:action.key, 
                            body:'', description:'',
                            isEditing:true, isComplete:false,  important:false, warning:false, payment:false, vacation:false, social:false,work:false,travel:false,
                            comments:[],
                            currentChecklistKey:1,
                            checklists:[],
                            cardColor:'',
                            fontColor:'',
                            dueDate:null,
                            displayImageUrls:[],
                            attachedFiles:[],
                            labels:[],
                            
                            linkedTasks:[],
                            
                            dateCreated:moment().format(),
                            lastEdited:moment().format(),

                            dialogOpen:false
                        },
                        ...board.tasks
                    ]
                }
            }
            return board
        }),
        taskCount:state.taskCount + 1
    }
}

export function _editTask(state, action){
    return{
        ...state,
        isDataSaved:false,
        boards:state.boards.map(board => {
            if(board.key === action.task.boardKey){
                return{
                    ...board,
                    tasks:board.tasks.map(task => {
                        if(task.key === action.task.key){
                            return {
                                ...action.task,
                                lastEdited:moment().format()
                            }
                        }
                        return task
                    })
                }
            }
            return board
        }),
        selectedTask:{
            ...action.task,
            lastEdited:moment().format()
        }
    }
}

export function _deleteTask(state, action){
    let newBoards = state.boards.slice();
    let modifiedBoard = newBoards.find((board) => board.key === action.task.boardKey);
    let modifiedTaskIndex = modifiedBoard.tasks.findIndex((task) => task.key === action.task.key);
    modifiedBoard.tasks.splice(modifiedTaskIndex, 1);
    
    return{
        ...state,
        isDataSaved:false,
        boards:newBoards,
        taskCount:state.taskCount - 1
    }
}

export function _transferTaskEmpty(state, action){
    let {droppedTaskId, droppedTaskBoard, droppedOnTaskBoard} = action.payload;
    let newBoards = state.boards.slice()
    let droppedOnBoard = newBoards.find((board) => board.key === droppedOnTaskBoard);
    let draggedBoard   = newBoards.find((board) => board.key === droppedTaskBoard);

    let draggedIndex = draggedBoard.tasks.findIndex((task)=> task.key === droppedTaskId) 
    let addedItem = {...draggedBoard.tasks[draggedIndex], ...{}};
    addedItem.boardKey = droppedOnTaskBoard;
    draggedBoard.tasks.splice(draggedIndex, 1);
    droppedOnBoard.tasks.push(addedItem);

    return {
        ...state,
        isDataSaved:false,
        boards:newBoards
    };
}

export function _transferTask(state, action){
    let {droppedOnTaskId, droppedOnTaskBoard, droppedTaskId, droppedTaskBoard, droppedAbove} = action.payload;
    let newBoards = state.boards.slice();

    if(droppedOnTaskBoard === droppedTaskBoard){
        let modifiedBoard = newBoards.find(board => board.key === droppedOnTaskBoard);

        let draggedTask = modifiedBoard.tasks.find(task => task.key === droppedTaskId);
        let droppedOnTask = modifiedBoard.tasks.find(task => task.key === droppedOnTaskId);


        if(draggedTask.key !== droppedOnTask.key){
            modifiedBoard.tasks = modifiedBoard.tasks.filter(task => task.key !== draggedTask.key);

            if(droppedAbove){
                modifiedBoard.tasks = modifiedBoard.tasks.map(task => {
                    if(task.key === droppedOnTask.key){
                        return [draggedTask, droppedOnTask];
                    }
                    return task;
                })
            }
            else{
                modifiedBoard.tasks = modifiedBoard.tasks.map(task => {
                    if(task.key === droppedOnTask.key){
                        return [droppedOnTask, draggedTask];
                    }
                    return task;
                })
            }
    
            modifiedBoard.tasks = modifiedBoard.tasks.flat()
        }
        
    }
    else{
        let droppedOnBoard = newBoards.find((board) => board.key === droppedOnTaskBoard);
        let draggedBoard   = newBoards.find((board) => board.key === droppedTaskBoard);

        let draggedTask = draggedBoard.tasks.find(task => task.key === droppedTaskId);
        let droppedOnTask = droppedOnBoard.tasks.find(task => task.key === droppedOnTaskId);

        draggedBoard.tasks = draggedBoard.tasks.filter(task => task.key !== draggedTask.key);
        
        if(droppedAbove){
            droppedOnBoard.tasks = droppedOnBoard.tasks.map(task => {
                if(task.key === droppedOnTask.key){
                    return [{...draggedTask, boardKey: droppedOnBoard.key}, droppedOnTask]
                }
                return task;
            })
        }
        else{
            droppedOnBoard.tasks = droppedOnBoard.tasks.map(task => {
                if(task.key === droppedOnTask.key){
                    return [droppedOnTask, {...draggedTask, boardKey: droppedOnBoard.key}]
                }
                return task;
            })
        }

        droppedOnBoard.tasks = droppedOnBoard.tasks.flat();

    }

    return {
        ...state,
        isDataSaved:false,
        boards:newBoards
    };

}

export function _linkTask(state, action){
    let newBoards = state.boards.slice();
    newBoards.find(board => board.key === action.linkedBoardKey).tasks.find(task => task.key === action.linkedTaskKey).linkedTasks.push({taskKey:action.originalTaskKey, boardKey:action.originalBoardKey});
    newBoards.find(board => board.key === action.originalBoardKey).tasks.find(task => task.key === action.originalTaskKey).linkedTasks.push({taskKey:action.linkedTaskKey, boardKey:action.linkedBoardKey});
    
    return {
        ...state,
        isDataSaved:false,
        boards:newBoards
    };
}

export function _archiveTask(state, action){
    let newBoards = state.boards.slice();
    let modifiedBoard = newBoards.find((board) => board.key === action.task.boardKey);
    modifiedBoard.tasks = modifiedBoard.tasks.filter(task => task.key !== action.task.key);

    return {
        ...state,
        boards:newBoards,
        archivedTasks:[...state.archivedTasks, action.task],
        taskCount: state.taskCount - 1
    }
}

export function _restoreArchivedTask(state, action){
    const {task, board} = action;
    console.log('_restoreArchivedTask')
    return {
        ...state,
        archivedTasks:state.archivedTasks.filter(archived => archived.key !== task.key),
        boards:state.boards.map(sboard => {
            if(sboard.key === board.key){
                return {
                    ...board,
                    tasks:[
                        ...board.tasks, 
                        {
                            ...task,
                            boardKey: board.key
                        }
                    ]
                }
            }
            return sboard
        }),
        taskCount: state.taskCount + 1
    }
}