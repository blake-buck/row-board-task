import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { editTask } from 'src/app/store/app.actions';
import { AppStore } from 'src/app/store/app.state';
import { addComment, deleteComment } from '../../task_dialog.logic';

@Component({
    selector:'dialog-comments',
    templateUrl:'dialog-comments.component.html',
    styleUrls:['../../task_dialog.component.css']
})

export class DialogCommentsComponent{
    @Input() data;

    constructor(private store:Store<AppStore>){}
    commentContent = '';

    changeCommentContent(e){
        this.commentContent = e.target.value;
    }
    addComment(data){
        this.store.dispatch(editTask({task:addComment(data, this.commentContent)}))
        this.commentContent = '';
    }
    deleteComment(data, comment){
        this.store.dispatch(editTask({task:deleteComment(data, comment.date)}))
    }
}