import { Task } from '../../../../../shared/types';

export function addCompletionStyling(property, task:Task){
    if(task.isComplete && property === 'opacity'){
        return '.5'
    }
    else if(task.isComplete && property === 'text-decoration'){
        return 'line-through'
    }
    else{
        return ''
    }
}

export function onDrop(transferredData, task:Task, droppedAbove){
    if(transferredData.includes('+')){
        transferredData = transferredData.split('+')
        let droppedTaskId = +transferredData[0];
        let droppedTaskBoard = +transferredData[1];

        let droppedOnTaskId = task.key;
        let droppedOnTaskBoard = task.boardKey;

        return {droppedOnTaskId, droppedOnTaskBoard, droppedTaskId, droppedTaskBoard, droppedAbove}
    }
    return null;
}

export function labelLength(textLength){
    if(textLength > 2){
        return textLength
    }
    return 2;
}

export function cyclePhoto(isForward, displayImageUrls, currentDisplayPhoto){
    if(isForward && currentDisplayPhoto < displayImageUrls.length -1){
        return currentDisplayPhoto +=1;
    }
    else if(isForward && currentDisplayPhoto === displayImageUrls.length - 1){
        return currentDisplayPhoto = 0;
    }
    else if(!isForward && currentDisplayPhoto === 0){
        return currentDisplayPhoto = displayImageUrls.length - 1;
    }
    else{
        return currentDisplayPhoto -= 1;
    }

}