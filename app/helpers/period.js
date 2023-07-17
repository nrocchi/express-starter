const {
  format,
  startOfToday,
  endOfToday,
  eachHourOfInterval,
  startOfYesterday,
  endOfYesterday,
  subDays,
  startOfWeek,
  endOfWeek,
  subWeeks,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
  subYears,
  startOfQuarter,
  endOfQuarter,
  subQuarters,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
} = require('date-fns')
const {fr} = require('date-fns/locale')
const config = require('../config/config')

const formatInterval = (interval) => {
  const formattedInterval = interval.map((value) =>
    format(value, config.formatDate, {locale: fr}),
  )
  return formattedInterval
}

exports.getPeriod = async (code) => {
  let interval

  switch (code) {
    case 'TODAY':
      interval = eachHourOfInterval({
        start: startOfToday(),
        end: endOfToday(),
      })
      interval.push(endOfToday())

      return {
        current: {
          start: format(startOfToday(), config.formatDate),
          end: format(endOfToday(), config.formatDate),
        },
        previous: {
          start: format(startOfYesterday(), config.formatDate),
          end: format(endOfYesterday(), config.formatDate),
        },
        interval: formatInterval(interval),
      }
    case 'YESTERDAY':
      interval = eachHourOfInterval({
        start: startOfYesterday(),
        end: endOfYesterday(),
      })
      interval.push(endOfYesterday())

      return {
        current: {
          start: format(startOfYesterday(), config.formatDate),
          end: format(endOfYesterday(), config.formatDate),
        },
        previous: {
          start: format(subDays(startOfYesterday(), 1), config.formatDate),
          end: format(subDays(endOfYesterday(), 1), config.formatDate),
        },
        interval: formatInterval(interval),
      }
    case 'THISWEEK':
      interval = eachDayOfInterval({
        start: startOfWeek(new Date(), {weekStartsOn: 1}),
        end: endOfWeek(new Date(), {weekStartsOn: 1}),
      })
      interval.push(endOfWeek(new Date(), {weekStartsOn: 1}))

      return {
        current: {
          start: format(
            startOfWeek(new Date(), {weekStartsOn: 1}),
            config.formatDate,
          ),
          end: format(
            endOfWeek(new Date(), {weekStartsOn: 1}),
            config.formatDate,
          ),
        },
        previous: {
          start: format(
            subWeeks(startOfWeek(new Date(), {weekStartsOn: 1}), 1),
            config.formatDate,
          ),
          end: format(
            subWeeks(endOfWeek(new Date(), {weekStartsOn: 1}), 1),
            config.formatDate,
          ),
        },
        interval: formatInterval(interval),
      }
    case 'THISMONTH':
      interval = eachDayOfInterval({
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date()),
      })
      interval.push(endOfMonth(new Date()))

      return {
        current: {
          start: format(startOfMonth(new Date()), config.formatDate),
          end: format(endOfMonth(new Date()), config.formatDate),
        },
        previous: {
          start: format(
            subMonths(startOfMonth(new Date()), 1),
            config.formatDate,
          ),
          end: format(subMonths(endOfMonth(new Date()), 1), config.formatDate),
        },
        interval: formatInterval(interval),
      }
    case 'THISQUARTER':
      interval = eachWeekOfInterval({
        start: startOfQuarter(new Date()),
        end: endOfQuarter(new Date()),
      })
      interval.push(endOfQuarter(new Date()))

      return {
        current: {
          start: format(startOfQuarter(new Date()), config.formatDate),
          end: format(endOfQuarter(new Date()), config.formatDate),
        },
        previous: {
          start: format(
            subQuarters(startOfQuarter(new Date()), 1),
            config.formatDate,
          ),
          end: format(
            subQuarters(endOfQuarter(new Date()), 1),
            config.formatDate,
          ),
        },
        interval: formatInterval(interval),
      }
    case 'THISYEAR':
      interval = eachMonthOfInterval({
        start: startOfYear(new Date()),
        end: endOfYear(new Date()),
      })
      interval.push(endOfYear(new Date()))

      return {
        current: {
          start: format(startOfYear(new Date()), config.formatDate),
          end: format(endOfYear(new Date()), config.formatDate),
        },
        previous: {
          start: format(
            subYears(startOfYear(new Date()), 1),
            config.formatDate,
          ),
          end: format(subYears(endOfYear(new Date()), 1), config.formatDate),
        },
        interval: formatInterval(interval),
      }
    case 'LASTWEEK':
      interval = eachDayOfInterval({
        start: subWeeks(startOfWeek(new Date(), {weekStartsOn: 1}), 1),
        end: subWeeks(endOfWeek(new Date(), {weekStartsOn: 1}), 1),
      })
      interval.push(subWeeks(endOfWeek(new Date(), {weekStartsOn: 1}), 1))

      return {
        current: {
          start: format(
            subWeeks(startOfWeek(new Date(), {weekStartsOn: 1}), 1),
            config.formatDate,
          ),
          end: format(
            subWeeks(endOfWeek(new Date(), {weekStartsOn: 1}), 1),
            config.formatDate,
          ),
        },
        previous: {
          start: format(
            subWeeks(startOfWeek(new Date(), {weekStartsOn: 1}), 2),
            config.formatDate,
          ),
          end: format(
            subWeeks(endOfWeek(new Date(), {weekStartsOn: 1}), 2),
            config.formatDate,
          ),
        },
        interval: formatInterval(interval),
      }
    case 'LASTMONTH':
      interval = eachDayOfInterval({
        start: subMonths(startOfMonth(new Date()), 1),
        end: subMonths(endOfMonth(new Date()), 1),
      })
      interval.push(subMonths(endOfMonth(new Date()), 1))

      return {
        current: {
          start: format(
            subMonths(startOfMonth(new Date()), 1),
            config.formatDate,
          ),
          end: format(subMonths(endOfMonth(new Date()), 1), config.formatDate),
        },
        previous: {
          start: format(
            subMonths(startOfMonth(new Date()), 2),
            config.formatDate,
          ),
          end: format(subMonths(endOfMonth(new Date()), 2), config.formatDate),
        },
        interval: formatInterval(interval),
      }
    case 'LASTQUARTER':
      interval = eachWeekOfInterval({
        start: subQuarters(startOfQuarter(new Date()), 1),
        end: subQuarters(endOfQuarter(new Date()), 1),
      })
      interval.push(subQuarters(endOfQuarter(new Date()), 1))

      return {
        current: {
          start: format(
            subQuarters(startOfQuarter(new Date()), 1),
            config.formatDate,
          ),
          end: format(
            subQuarters(endOfQuarter(new Date()), 1),
            config.formatDate,
          ),
        },
        previous: {
          start: format(
            subQuarters(startOfQuarter(new Date()), 2),
            config.formatDate,
          ),
          end: format(
            subQuarters(endOfQuarter(new Date()), 2),
            config.formatDate,
          ),
        },
        interval: formatInterval(interval),
      }
    case 'LASTYEAR':
      interval = eachMonthOfInterval({
        start: subYears(startOfYear(new Date()), 1),
        end: subYears(endOfYear(new Date()), 1),
      })
      interval.push(subYears(endOfYear(new Date()), 1))

      return {
        current: {
          start: format(
            subYears(startOfYear(new Date()), 1),
            config.formatDate,
          ),
          end: format(subYears(endOfYear(new Date()), 1), config.formatDate),
        },
        previous: {
          start: format(
            subYears(startOfYear(new Date()), 2),
            config.formatDate,
          ),
          end: format(subYears(endOfYear(new Date()), 2), config.formatDate),
        },
        interval: formatInterval(interval),
      }
    case 'LAST2YEARS':
      interval = eachYearOfInterval({
        start: subYears(startOfYear(new Date()), 2),
        end: subYears(endOfYear(new Date()), 1),
      })
      interval.push(subYears(endOfYear(new Date()), 1))

      return {
        current: {
          start: format(
            subYears(startOfYear(new Date()), 2),
            config.formatDate,
          ),
          end: format(subYears(endOfYear(new Date()), 1), config.formatDate),
        },
        previous: {
          start: format(
            subYears(startOfYear(new Date()), 4),
            config.formatDate,
          ),
          end: format(subYears(endOfYear(new Date()), 3), config.formatDate),
        },
        interval: formatInterval(interval),
      }
    case 'LAST5YEARS':
      interval = eachYearOfInterval({
        start: subYears(startOfYear(new Date()), 5),
        end: subYears(endOfYear(new Date()), 1),
      })
      interval.push(subYears(endOfYear(new Date()), 1))

      return {
        current: {
          start: format(
            subYears(startOfYear(new Date()), 5),
            config.formatDate,
          ),
          end: format(subYears(endOfYear(new Date()), 1), config.formatDate),
        },
        previous: {
          start: format(
            subYears(startOfYear(new Date()), 10),
            config.formatDate,
          ),
          end: format(subYears(endOfYear(new Date()), 6), config.formatDate),
        },
        interval: formatInterval(interval),
      }
    default:
      return false
  }
}
