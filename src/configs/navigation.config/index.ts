import {
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    {
        key: 'home',
        path: '/home',
        title: 'Inicio',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'savings',
        path: '/savings',
        title: 'Ahorros',
        translateKey: 'nav.savings',
        icon: 'savings',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'incomes',
        path: '/incomes',
        title: 'Ingresos',
        translateKey: 'nav.incomes',
        icon: 'incomes',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'expenses',
        path: '/expenses',
        title: 'Gastos',
        translateKey: 'nav.expenses',
        icon: 'expenses',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'category',
        path: '/category',
        title: 'Categorías',
        translateKey: 'nav.category',
        icon: 'category',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'paymentReminder',
        path: '/payment-reminders',
        title: 'Recordatorios',
        translateKey: 'nav.notifications',
        icon: 'light',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'recurrentPayment',
        path: '/recurrent-payments',
        title: 'Pagos Recurrentes',
        translateKey: 'nav.frequent_payments',
        icon: 'creditCard',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'budget',
        path: '/budget-plan',
        title: 'Presupuesto',
        translateKey: 'nav.budget',
        icon: 'currency',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [],
    },
    {
        key: 'settings',
        path: '/settings',
        title: 'Ajustes',
        translateKey: 'nav.config',
        icon: 'config',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
]

export default navigationConfig
