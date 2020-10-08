import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector:'[vertical-scrolling]'
})

export class VerticalScrollingDirective{
    startScrollingBoundary = 125;

    delayDispatch = false;
    dragoverTimeout;
    
    @HostListener('dragover', ['$event.screenY']) onDragOver(screenY){
        if(!this.delayDispatch){
            this.delayDispatch = true;
            this.dragoverTimeout = setTimeout(() => {
                this.delayDispatch = false;
                if(screenY < this.startScrollingBoundary){
                    // scroll up
                    document.scrollingElement.scrollTop -= 20;
                }
                else if(screenY > window.innerHeight - this.startScrollingBoundary){
                    // scroll down
                    document.scrollingElement.scrollTop += 20;
                }
            }, 50)
        }
    }

}