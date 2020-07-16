import ky from 'ky/umd'

export const apiHost = ky.create({prefixUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/' : 'https://app.stakehousesports.com/api/'})

