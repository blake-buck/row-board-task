import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector:'[drag-scrolling]'
})

export class DragScrollingDirective{
    constructor(private el:ElementRef){}
    

    previousX = null;
    determineScrollDirection(screenX){
        let scrollAmount = 0;
        if(this.previousX === 0 || this.previousX){
            // scrollling right
            // dragging right to left
            if(screenX < this.previousX){
                scrollAmount = 10;
            }
            else{
                // scrolling left
                // dragging left to right
                scrollAmount = -10
            }
        }
        this.previousX = screenX;
        return scrollAmount;
    }

    mouseDown = false;
    @HostListener('mousedown', ['$event']) onMouseDown(e){
        if(e.target.classList.contains('board-wrapper') || e.target.classList.contains('board-list')){
            this.previousX = e.screenX;
            this.mouseDown=true;
            document.body.style.userSelect = 'none';
        }
    }

    @HostListener('mousemove', ['$event']) onMouseMove(e){
        // console.log(e);
        if(this.mouseDown){
            this.el.nativeElement.scrollLeft += this.determineScrollDirection(e.screenX);
        }
    }

    @HostListener('mouseup') onMouseUp(){
        if(this.mouseDown || this.previousX){
            document.body.style.userSelect = 'auto';
            this.mouseDown = false;
            this.previousX = null;
        }
    }
    @HostListener('mouseleave') onMouseLeave(){
        if(this.mouseDown || this.previousX){
            document.body.style.userSelect = 'auto';
            this.mouseDown = false;
            this.previousX = null;
        }
    }
}