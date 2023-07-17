const {isWithinInterval, parseISO} = require('date-fns')
const {utcToZonedTime} = require('date-fns-tz')
const _ = require('lodash')

const config = require('../../app/config/config')

exports.getTotal = async (type, key, results) => {
  let total = 0

  results.map((item) => {
    if (item[type].code === key) {
      total += 1
    }

    return false
  })

  return total
}

exports.getPercent = async (value, total) => {
  return total !== 0 ? (value / total) * 100 : 0
}

exports.getVariation = async (current, previous) => {
  if (current === 0 && previous === 0) {
    return 0
  }
  if (current > 0 && previous <= 0) {
    return 100
  }
  return (current / previous - 1) * 100
}

exports.getArray = (array) => {
  return array.filter((item) => item !== 0 && !_.isNull(item)).length
    ? array
    : []
}

exports.getCharts = async (results, periods) => {
  const periodsArray = []
  const activeArray = []
  const pendingArray = []
  const inactiveArray = []
  const superadminArray = []
  const adminArray = []
  const userArray = []

  const timezone = config.timezone === '+01:00' ? 'Etc/GMT-3' : 'Etc/GMT-4'

  for (let j = 0; j < periods.interval.length - 1; j += 1) {
    let active = 0
    let pending = 0
    let inactive = 0
    let superadmin = 0
    let admin = 0
    let user = 0

    results.map((item) => {
      const isInterval = isWithinInterval(
        utcToZonedTime(new Date(item.created_at), timezone),
        {
          start: parseISO(periods.interval[j]),
          end: parseISO(periods.interval[j + 1]),
        },
      )

      if (isInterval) {
        if (item.status.code === 'ACTIVE') {
          active += 1
        }
        if (item.status.code === 'PENDING') {
          pending += 1
        }
        if (item.status.code === 'INACTIVE') {
          inactive += 1
        }
        if (item.role.code === 'SUPER_ADMIN') {
          superadmin += 1
        }
        if (item.role.code === 'ADMIN') {
          admin += 1
        }
        if (item.role.code === 'USER') {
          user += 1
        }
      }
      return false
    })

    periodsArray.push(periods.interval[j])
    activeArray.push(active)
    pendingArray.push(pending)
    inactiveArray.push(inactive)
    superadminArray.push(superadmin)
    adminArray.push(admin)
    userArray.push(user)
  }

  const charts = {
    periods: this.getArray(periodsArray),
    datas: {
      status: {
        active: this.getArray(activeArray),
        pending: this.getArray(pendingArray),
        inactive: this.getArray(inactiveArray),
      },
      role: {
        superadmin: this.getArray(superadminArray),
        admin: this.getArray(adminArray),
        user: this.getArray(userArray),
      },
    },
  }

  return charts
}

exports.getStats = async (
  currentResults,
  previousResults,
  currentCount,
  previousCount,
  periods,
) => {
  const totalVariation = await this.getVariation(currentCount, previousCount)

  const charts = await this.getCharts(currentResults, periods)

  const activeCurrentTotal = await this.getTotal(
    'status',
    'ACTIVE',
    currentResults,
  )
  const activePreviousTotal = await this.getTotal(
    'status',
    'ACTIVE',
    previousResults,
  )
  const activeVariationTotal = await this.getVariation(
    activeCurrentTotal,
    activePreviousTotal,
  )
  const activeCurrentPercent = await this.getPercent(
    activeCurrentTotal,
    currentCount,
  )
  const activePreviousPercent = await this.getPercent(
    activePreviousTotal,
    previousCount,
  )
  const activeVariationPercent = await this.getVariation(
    activeCurrentPercent,
    activePreviousPercent,
  )

  const pendingCurrentTotal = await this.getTotal(
    'status',
    'PENDING',
    currentResults,
  )
  const pendingPreviousTotal = await this.getTotal(
    'status',
    'PENDING',
    previousResults,
  )
  const pendingVariationTotal = await this.getVariation(
    pendingCurrentTotal,
    pendingPreviousTotal,
  )
  const pendingCurrentPercent = await this.getPercent(
    pendingCurrentTotal,
    currentCount,
  )
  const pendingPreviousPercent = await this.getPercent(
    pendingPreviousTotal,
    previousCount,
  )
  const pendingVariationPercent = await this.getVariation(
    pendingCurrentPercent,
    pendingPreviousPercent,
  )

  const inactiveCurrentTotal = await this.getTotal(
    'status',
    'INACTIVE',
    currentResults,
  )
  const inactivePreviousTotal = await this.getTotal(
    'status',
    'INACTIVE',
    previousResults,
  )
  const inactiveVariationTotal = await this.getVariation(
    inactiveCurrentTotal,
    inactivePreviousTotal,
  )
  const inactiveCurrentPercent = await this.getPercent(
    inactiveCurrentTotal,
    currentCount,
  )
  const inactivePreviousPercent = await this.getPercent(
    inactivePreviousTotal,
    previousCount,
  )
  const inactiveVariationPercent = await this.getVariation(
    inactiveCurrentPercent,
    inactivePreviousPercent,
  )

  const superadminCurrentTotal = await this.getTotal(
    'role',
    'SUPER_ADMIN',
    currentResults,
  )
  const superadminPreviousTotal = await this.getTotal(
    'role',
    'SUPER_ADMIN',
    previousResults,
  )
  const superadminVariationTotal = await this.getVariation(
    superadminCurrentTotal,
    superadminPreviousTotal,
  )
  const superadminCurrentPercent = await this.getPercent(
    superadminCurrentTotal,
    currentCount,
  )
  const superadminPreviousPercent = await this.getPercent(
    superadminPreviousTotal,
    previousCount,
  )
  const superadminVariationPercent = await this.getVariation(
    superadminCurrentPercent,
    superadminPreviousPercent,
  )

  const adminCurrentTotal = await this.getTotal('role', 'ADMIN', currentResults)
  const adminPreviousTotal = await this.getTotal(
    'role',
    'ADMIN',
    previousResults,
  )
  const adminVariationTotal = await this.getVariation(
    adminCurrentTotal,
    adminPreviousTotal,
  )
  const adminCurrentPercent = await this.getPercent(
    adminCurrentTotal,
    currentCount,
  )
  const adminPreviousPercent = await this.getPercent(
    adminPreviousTotal,
    previousCount,
  )
  const adminVariationPercent = await this.getVariation(
    adminCurrentPercent,
    adminPreviousPercent,
  )

  const userCurrentTotal = await this.getTotal('role', 'USER', currentResults)
  const userPreviousTotal = await this.getTotal('role', 'USER', previousResults)
  const userVariationTotal = await this.getVariation(
    userCurrentTotal,
    userPreviousTotal,
  )
  const userCurrentPercent = await this.getPercent(
    userCurrentTotal,
    currentCount,
  )
  const userPreviousPercent = await this.getPercent(
    userPreviousTotal,
    previousCount,
  )
  const userVariationPercent = await this.getVariation(
    userCurrentPercent,
    userPreviousPercent,
  )

  return {
    total: {
      current: currentCount,
      previous: previousCount,
      variation: totalVariation,
    },
    active: {
      total: {
        current: activeCurrentTotal,
        previous: activePreviousTotal,
        variation: activeVariationTotal,
      },
      percent: {
        current: activeCurrentPercent,
        previous: activePreviousPercent,
        variation: activeVariationPercent,
      },
    },
    pending: {
      total: {
        current: pendingCurrentTotal,
        previous: pendingPreviousTotal,
        variation: pendingVariationTotal,
      },
      percent: {
        current: pendingCurrentPercent,
        previous: pendingPreviousPercent,
        variation: pendingVariationPercent,
      },
    },
    inactive: {
      total: {
        current: inactiveCurrentTotal,
        previous: inactivePreviousTotal,
        variation: inactiveVariationTotal,
      },
      percent: {
        current: inactiveCurrentPercent,
        previous: inactivePreviousPercent,
        variation: inactiveVariationPercent,
      },
    },
    superadmin: {
      total: {
        current: superadminCurrentTotal,
        previous: superadminPreviousTotal,
        variation: superadminVariationTotal,
      },
      percent: {
        current: superadminCurrentPercent,
        previous: superadminPreviousPercent,
        variation: superadminVariationPercent,
      },
    },
    admin: {
      total: {
        current: adminCurrentTotal,
        previous: adminPreviousTotal,
        variation: adminVariationTotal,
      },
      percent: {
        current: adminCurrentPercent,
        previous: adminPreviousPercent,
        variation: adminVariationPercent,
      },
    },
    user: {
      total: {
        current: userCurrentTotal,
        previous: userPreviousTotal,
        variation: userVariationTotal,
      },
      percent: {
        current: userCurrentPercent,
        previous: userPreviousPercent,
        variation: userVariationPercent,
      },
    },
    charts,
    current: {
      datas: currentResults,
      total: currentCount,
    },
    previous: {
      datas: previousResults,
      total: previousCount,
    },
  }
}
