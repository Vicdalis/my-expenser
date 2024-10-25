import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { apiGetSalesDashboardData } from '@/services/SalesService'
import moment from 'moment'

type Statistic = {
    value: number
    growShrink: number
}

export type DashboardData = {
    statisticData?: {
        revenue: Statistic
        orders: Statistic
        purchases: Statistic
    }
    salesReportData?: {
        series: {
            name: string
            data: number[]
        }[]
        categories: string[]
    }
    topProductsData?: {
        id: string
        name: string
        img: string
        sold: number
    }[]
    latestOrderData?: {
        id: string
        date: number
        customer: string
        status: number
        paymentMehod: string
        paymentIdendifier: string
        totalAmount: number
    }[]
    salesByCategoriesData?: {
        labels: string[]
        data: number[]
    }
}

type DashboardDataResponse = DashboardData

export type SalesDashboardState = {
    startDate: string
    endDate: string
    loading: boolean
    dashboardData: DashboardData
}

export const SLICE_NAME = 'salesDashboard'

export const getSalesDashboardData = createAsyncThunk(
    SLICE_NAME + '/getSalesDashboardData',
    async () => {
        const response = await apiGetSalesDashboardData<DashboardDataResponse>()
        return response.data
    }
)

const initialState: SalesDashboardState = {
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().add(30, 'days').format('YYYY-MM-DD'),
    loading: true,
    dashboardData: {},
}

const salesDashboardSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setStartDate: (state, action) => {
            if(state.startDate != action.payload){
                state.startDate = action.payload
            }
        },
        setEndDate: (state, action) => {
            state.endDate = action.payload
        },
    },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(getSalesDashboardData.fulfilled, (state, action) => {
    //             console.log("🚀 ~ .addCase ~ action:", action)
    //             state.dashboardData = action.payload
    //             state.loading = false
    //         })
    //         .addCase(getSalesDashboardData.pending, (state) => {
    //             console.log("🚀 ~ .addCase ~ state:", state)
    //             state.loading = true
    //         })
    // },
})

export const { setStartDate, setEndDate } = salesDashboardSlice.actions

export default salesDashboardSlice.reducer
