export default class DateUtils {
    static next(callback: (date: Date) => void): Date {
        const date = new Date()
        date.setHours(
            0,
            0,
            0,
            0
        )
        callback(date)

        return date
    }
    
    static nextYear(): Date {
        return this.next(
            date => {
                date.setFullYear(
                    date.getFullYear() + 1
                )
            }
        )
    }

    static nextMonth(): Date {
        return this.next(
            date => {
                date.setMonth(
                    date.getMonth() + 1
                )
            }
        )
    }
    static nextDay(): Date {
        return this.next(
            date => {
                date.setDate(
                    date.getDate() + 1
                )
            }
        )
    }
}