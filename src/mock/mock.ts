import { createServer } from 'miragejs'
import appConfig from '@/configs/app.config'

import { signInUserData } from './data/authData'

import { authFakeApi, salesFakeApi } from './fakeApi'

import {
    productsData,
    ordersData,
    orderDetailsData,
    salesDashboardData,
} from './data/salesData';

const { apiPrefix } = appConfig

export function mockServer({ environment = 'test' }) {
    return createServer({
        environment,
        seeds(server) {
            server.db.loadData({
                signInUserData,
                salesDashboardData,
                productsData,
                ordersData,
                orderDetailsData,
            })
        },
        routes() {
            this.urlPrefix = ''
            this.namespace = ''
            this.passthrough((request) => {
                const isExternal = request.url.startsWith('http')
                return isExternal
            })
            this.passthrough()

            authFakeApi(this, apiPrefix)
            salesFakeApi(this, apiPrefix)
        },
    })
}
