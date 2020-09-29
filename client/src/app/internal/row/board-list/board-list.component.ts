import { Component, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector:'board-list',
    templateUrl:'board-list.component.html',
    styleUrls:['../row.component.css']
})

export class BoardListComponent{
    @Input() boards$;
    @Input() onMouseEnter;
    @Input() onMouseLeave;
    @ViewChild('scrollRow', {static:false}) scrollRow: ElementRef;

    scrollRowForward(){
        return () => {
            if(this.scrollRow && this.scrollRow.nativeElement){
                this.scrollRow.nativeElement.scrollLeft = this.scrollRow.nativeElement.scrollLeft + 10; 
            }
        }
        
    }

    scrollRowBackward(){
        return () => {
            if(this.scrollRow && this.scrollRow.nativeElement){
                this.scrollRow.nativeElement.scrollLeft = this.scrollRow.nativeElement.scrollLeft - 10;
            }
        }
    }

}