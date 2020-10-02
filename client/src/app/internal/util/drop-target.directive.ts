import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector:'[drop-target]'
})

export class DropTargetDirective{
    constructor(private el: ElementRef){}
    
    @HostListener('dragover', ['$event']) onDragOver(e){
        if(!e.dataTransfer.getData('text/plain').includes('BOARD')){
            if(e.layerY < (this.el.nativeElement.offsetHeight /2)){
                this.el.nativeElement.style.borderTop = '2px solid black';
                this.el.nativeElement.style.borderTopLeftRadius = '0px';
                this.el.nativeElement.style.borderTopRightRadius = '0px';
                this.el.nativeElement.style.borderBottom = '';
            }
            else{
                this.el.nativeElement.style.borderTop = '';
                this.el.nativeElement.style.borderBottomLeftRadius = '0px';
                this.el.nativeElement.style.borderBottomRightRadius = '0px';
                this.el.nativeElement.style.borderBottom = '2px solid black';
            }
        }
    }
    @HostListener('dragend', ['$event']) onDragEnd(e){
        this.el.nativeElement.style.borderTop = '';
        this.el.nativeElement.style.borderBottom = '';
        this.el.nativeElement.style.borderTopLeftRadius = '';
        this.el.nativeElement.style.borderTopRightRadius = '';
        this.el.nativeElement.style.borderBottomLeftRadius = '';
        this.el.nativeElement.style.borderBottomRightRadius = '';
    }
    @HostListener('dragexit', ['$event']) onDragExit(e){
        this.el.nativeElement.style.borderTop = '';
        this.el.nativeElement.style.borderBottom = '';
        this.el.nativeElement.style.borderTopLeftRadius = '';
        this.el.nativeElement.style.borderTopRightRadius = '';
        this.el.nativeElement.style.borderBottomLeftRadius = '';
        this.el.nativeElement.style.borderBottomRightRadius = '';
    }
    @HostListener('dragleave', ['$event']) onDragLeave(e){
        this.el.nativeElement.style.borderTop = '';
        this.el.nativeElement.style.borderBottom = '';
        this.el.nativeElement.style.borderTopLeftRadius = '';
        this.el.nativeElement.style.borderTopRightRadius = '';
        this.el.nativeElement.style.borderBottomLeftRadius = '';
        this.el.nativeElement.style.borderBottomRightRadius = '';
    }
    @HostListener('drop', ['$event']) onDrop(e){
        this.el.nativeElement.style.borderTop = '';
        this.el.nativeElement.style.borderBottom = '';
        this.el.nativeElement.style.borderTopLeftRadius = '';
        this.el.nativeElement.style.borderTopRightRadius = '';
        this.el.nativeElement.style.borderBottomLeftRadius = '';
        this.el.nativeElement.style.borderBottomRightRadius = '';
    }
    
}