import { Component, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector:'board-list',
    templateUrl:'board-list.component.html',
    styleUrls:['../row.component.css']
})

export class BoardListComponent{
    @Input() boards$;
    
    @ViewChild('scrollRow', {static:false}) scrollRow: ElementRef;

    onMouseEnter(e){
        e.preventDefault();
        const startScrollingBoundary = 125;
        if(e.screenX > window.innerWidth - startScrollingBoundary){
            this.scrollRowForward()
        }   
        else if(e.screenX < startScrollingBoundary){
            this.scrollRowBackward()
        }
    }
    onMouseLeave(e){
        e.preventDefault();
    }

    scrollRowForward(){
        if(this.scrollRow && this.scrollRow.nativeElement){
            this.scrollRow.nativeElement.scrollLeft = this.scrollRow.nativeElement.scrollLeft + 10; 
        }
        
    }

    scrollRowBackward(){
        if(this.scrollRow && this.scrollRow.nativeElement){
            this.scrollRow.nativeElement.scrollLeft = this.scrollRow.nativeElement.scrollLeft - 10;
        }
    }

}