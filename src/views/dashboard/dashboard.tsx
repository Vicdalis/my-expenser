import Loading from "@/components/shared/Loading";
import React, { useEffect, useState } from "react";
import Statistic from './Statistic'
import SalesByCategories from "./SalesByCategories";
import TaskOverview from "./TaskOverview";
import LatestOrder from "./LatestOrder";
import TopProduct from "./TopProduct";
import { getSalesDashboardData, setStartDate, useAppSelector } from "./store";
import { useAppDispatch } from '@/store'
import DashboardHeader from "./dashboardHeader";


const DashboardComponent = () => {
    const [statistics, setStatistics] = useState({
        revenue: {
            value: 200000,
            growShrink: 350000
        },
        orders: {
            value: 200000,
            growShrink: 350000
        },
        purchases: {
            value: 200000,
            growShrink: 350000
        }
    });

    const [expensesCategories, setCategories] = useState({
        labels: ['Comida', 'Belleza', 'Gym', 'Salud'],
        data: [351, 246, 144, 83],
    })

    const [expensesOverview, setExpensesOverview] = useState({
        chart: {
            daily: {
                onGoing: 13,
                finished: 9,
                total: 21,
                series: [
                    {
                        name: 'On Going',
                        data: [20, 19, 18, 14, 12, 10],
                    },
                    {
                        name: 'Finished',
                        data: [1, 4, 8, 15, 16, 18],
                    },
                ],
                range: [
                    '6:00am',
                    '9:00am',
                    '12:00pm',
                    '03:00pm',
                    '06:00pm',
                    '09:00pm',
                ],
            },
            weekly: {
                onGoing: 126,
                finished: 87,
                total: 213,
                series: [
                    {
                        name: 'On Going',
                        data: [45, 52, 68, 84, 103, 112, 126],
                    },
                    {
                        name: 'Finished',
                        data: [35, 41, 62, 62, 75, 81, 87],
                    },
                ],
                range: [
                    '21 Jan',
                    '22 Jan',
                    '23 Jan',
                    '24 Jan',
                    '25 Jan',
                    '26 Jan',
                    '27 Jan',
                ],
            },
            monthly: {
                onGoing: 270,
                finished: 113,
                total: 383,
                series: [
                    {
                        name: 'On Going',
                        data: [28, 52, 91, 154, 227, 256, 270],
                    },
                    {
                        name: 'Finished',
                        data: [22, 31, 74, 88, 97, 107, 113],
                    },
                ],
                range: [
                    '01 Jan',
                    '05 Jan',
                    '10 Jan',
                    '15 Jan',
                    '20 Jan',
                    '25 Jan',
                    '27 Jan',
                ],
            },
        },
    })

    const dispatch = useAppDispatch()

    const dashboardData = useAppSelector(
        (state) => {
            console.log("🚀 ~ DashboardComponent ~ state:", state)
            return state.salesDashboard?.data.dashboardData
        }
    )

    const loading = useAppSelector((state) => {
        console.log("🚀 ~ loading ~ state:", state);
        return state.salesDashboard?.data.loading;
    })

    

    useEffect(() => {
        fetchData()
        
    }, [])

    const fetchData = () => {
        dispatch(getSalesDashboardData())
        // dispatch(setStartDate(1720483615))
    }

    return (
        <div className="flex flex-col gap-4 h-full">
            <Loading loading={loading}>
                <DashboardHeader></DashboardHeader>
                <Statistic data={statistics} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <TaskOverview
                        data={expensesOverview}
                        className="col-span-2"
                    />
                    <SalesByCategories
                        data={expensesCategories}
                    />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <LatestOrder
                        data={dashboardData?.latestOrderData}
                        className="lg:col-span-2"
                    />
                    <TopProduct data={dashboardData?.topProductsData} />
                </div>
            </Loading>
        </div>
    )
}

export default DashboardComponent;