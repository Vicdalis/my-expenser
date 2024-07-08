import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/home')),
        authority: [],
    },
    {
        key: 'category',
        path: '/category',
        component: lazy(() => import('@/views/category')),
        authority: [],
    },
    {
        key: 'recurrentPayment',
        path: '/recurrent-payments',
        component: lazy(() => import('@/views/regular-payments')),
        authority: [],
    },
    {
        key: 'paymentReminder',
        path: '/payment-reminders',
        component: lazy(() => import('@/views/payment-reminders')),
        authority: [],
    },
    {
        key: 'budget',
        path: '/budget-plan',
        component: lazy(() => import('@/views/budget')),
        authority: [],
    },
    {
        key: 'settings',
        path: '/settings',
        component: lazy(() => import('@/views/settings')),
        authority: [],
    },
    /** Example purpose only, please remove */
    {
        key: 'singleMenuItem',
        path: '/single-menu-view',
        component: lazy(() => import('@/views/demo/SingleMenuView')),
        authority: [],
    },
    
]