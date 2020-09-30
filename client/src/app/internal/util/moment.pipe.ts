import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name:'momentPipe'
})
export class MomentPipe implements PipeTransform{
    transform(value, mode, format){
        if(mode === 'format'){
            return moment(value).format(format);
        }
        if(mode === 'fromNow'){
            return moment(value).fromNow();
        }
        throw new Error('Improper mode provided to momentPipe');
    }
}