import dayjs from 'dayjs'

export function generateRangeDatesFromYearStart() {
  const FirstDayOfTheYear = dayjs().startOf('year')
    const today = new Date()
    const dates=[]

    let compareDate = FirstDayOfTheYear
    while(compareDate.isBefore(today)){
        dates.push(compareDate.toDate())
        compareDate = compareDate.add(1, 'day')
    }
    return dates
    
}