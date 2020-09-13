import * as moment from 'moment';

export const months =[
    'January',
    'Febuary',
    'Match',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

export const currentDayMoment = moment();

export function calculateDays(selectedYear, selectedMonthIndex){
    return new Array(moment().year(selectedYear).month(selectedMonthIndex).daysInMonth())
}

export function calculateFirstDayOfMonth(selectedYear, selectedMonthIndex){
    return moment().year(selectedYear).month(selectedMonthIndex).date(1).weekday()
}

export function tabChange(e, selectedYear, dueDateMoment){
    let selectedMonthIndex = e;
    let days= calculateDays(selectedYear, selectedMonthIndex)
    let firstDayOfMonthIsoIndex = calculateFirstDayOfMonth(selectedYear, selectedMonthIndex)

    if(selectedMonthIndex === moment().month()){
        days[moment().date()-1] ='cyan'
    }
    if(dueDateMoment && dueDateMoment.year() === selectedYear && dueDateMoment.month() === selectedMonthIndex){
        days[dueDateMoment.date()-1] = '#adff2f'
    }

    return{
        selectedMonthIndex,
        days,
        firstDayOfMonthIsoIndex
    }
}

export function dateSelection(day, selectedYear, selectedMonthIndex, dueDateMoment, data){
        
    let days = calculateDays(selectedYear, selectedMonthIndex)
    if(dueDateMoment.year() === selectedYear && selectedMonthIndex === moment().month()){
        days[moment().date()-1] ='cyan'

    }
    days[day] = '#adff2f'

    dueDateMoment = moment();
    dueDateMoment.set('year', selectedYear)
    dueDateMoment.set('month',selectedMonthIndex);
    dueDateMoment.set('date', day + 1) 

    data.dueDate = dueDateMoment;
    return {data, days}
}