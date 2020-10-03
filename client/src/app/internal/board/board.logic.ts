import * as moment from 'moment';
import { Board, Task } from '../../../../../shared/types';

// todo replace all these hand rolled bubble sorts with array.sort()
export function orderByLastEdited(tasks:Task[]){
    let orderedArray = tasks.slice(0, tasks.length + 1);

    for(let i=0; i < orderedArray.length; i++){
        for(let j=i; j<orderedArray.length; j++){
            if(moment(orderedArray[j].lastEdited).isAfter(orderedArray[i].lastEdited)){
                let placeholder = orderedArray[i];
                orderedArray[i] = orderedArray[j];
                orderedArray[j] = placeholder;
            }
        }
    }
    return orderedArray;
}

export function orderByAlphabetical(tasks:Task[]){
    let reorganizedBoard = [];
    let orderedArray = tasks.slice(0, tasks.length + 1);

    tasks.map(val => {
        reorganizedBoard.push(turnStringIntoNumber(val.body));
    })

    for(let i=0; i< orderedArray.length; i++){
        
        for(let j=i; j<orderedArray.length; j++){
            if(reorganizedBoard[j] < reorganizedBoard[i]){
                let placeholder = orderedArray[i]
                orderedArray[i]=orderedArray[j];
                orderedArray[j] = placeholder;

                placeholder = reorganizedBoard[i]
                reorganizedBoard[i] = reorganizedBoard[j];
                reorganizedBoard[j] = placeholder;
                i=0;
                j=0;
            }
        }
    }

    return orderedArray
}

function turnStringIntoNumber(text){
    let characterArray = text.split('');
    let number = 0;
    for(let i=0; i<6 && i<characterArray.length; i++){
        number += turnCharacterIntoNumber(characterArray[i]) * (Math.pow(10, (-1*(i*2))))
    }
    return number
}

function turnCharacterIntoNumber(character){
    let char= character.toUpperCase().charCodeAt(0);
    if(char <65 || char >92){
        return 1
    }
    return char;
}

export function orderByDateCreated(tasks:Task[]){
    let orderedArray = tasks.slice(0, tasks.length+1)
       
    for(let i=0; i< tasks.length; i++){
        for(let j=i; j < tasks.length; j++){

            if(moment(orderedArray[j].dateCreated).isBefore(orderedArray[i].dateCreated)){
                
                let placeholder = orderedArray[i];

                orderedArray[i] = orderedArray[j];
                orderedArray[j] = placeholder;
            }

        }
    }

    return orderedArray
}

export function orderByCompletion(tasks:Task[]){
    let orderedArray = [];
    for(let i =0; i < tasks.length; i++){
        if(tasks[i].isComplete){
            orderedArray.push(tasks[i]);
        }
        else{
            orderedArray.unshift(tasks[i]);
        }
    }
    return orderedArray;
}

export function reverseList(tasks:Task[]){
    return tasks.reverse()
}

export function onDrop(eventDataTransfer, board:Board, boardKey:number){
    let type = '';
    let payload = {};
    
    if((board.tasks.length === 0 || board.tasks.filter(task => !task.isComplete).length === 0) && eventDataTransfer.includes('+')){
        
        let transferedData = eventDataTransfer.split('+')
        let droppedTaskId    = +transferedData[0];
        let droppedTaskBoard = +transferedData[1];

        type = 'TRANSFER_TASK_EMPTY'
        payload = {droppedTaskId, droppedTaskBoard, droppedOnTaskBoard:boardKey};
        return {type:type, payload:payload}
    }
    else if(eventDataTransfer.includes('BOARD')){
        let unSanitizedKeys = eventDataTransfer.replace('BOARD', '');
        let keyArray = unSanitizedKeys.split('-')
        let droppedOnBoardKey = board.key;
        
        type = 'TRANSFER_BOARD'
        payload = {draggedBoardKey:+keyArray[0], draggedBoardRowKey:+keyArray[1], droppedOnBoardKey, droppedOnRowKey:board.rowKey}
        return {type:type, payload:payload}
    }
    
}