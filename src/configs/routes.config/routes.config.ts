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
        key: 'savings',
        path: '/savings',
        component: lazy(() => import('@/views/savings')),
        authority: [],
    },
    {
        key: 'incomes',
        path: '/incomes',
        component: lazy(() => import('@/views/incomes')),
        authority: [],
    },
    {
        key: 'expenses',
        path: '/expenses',
        component: lazy(() => import('@/views/expenses/expenses')),
        authority: [],
    },
    {
        key: 'category',
        path: '/category',
        component: lazy(() => import('@/views/category/category')),
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