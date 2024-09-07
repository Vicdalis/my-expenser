import Loading from "@/components/shared/Loading";
import { useEffect, useState } from "react";

import SimpleDountChart from "../components/Charts/SimpleDonutChart";
import BarChartDouble from "../components/Charts/BarChartDouble";

import Statistic from './Statistic'
import TopProduct from "./TopProduct";
import LatestOrder from "./LatestOrder";
import DashboardHeader from "./dashboardHeader";
import DashboardHeaderButtons from "./dashboardHeaderButtons";

import { injectReducer, useAppDispatch } from '@/store'
import { getSalesDashboardData, useAppSelector } from "./store";
import  reducer, { getExpenseList, useAppSelector as useExpenseSelector } from "../expenses/store";
import { iCategories } from "@/utils/interfaces/categories.interface";

injectReducer('expense', reducer)

const DashboardComponent = () => {
    const [statistics, setStatistics] = useState({
        expenses: {
            value: 200000,
            growShrink: 0
        },
        incomes: {
            value: 200000,
            growShrink: 0
        },
        savings: {
            value: 200000,
            growShrink: 0
        }
    });

    const [expensesCategories, setCategories] = useState<iCategories>({
        labels: [],
        data: [],
        title: 'Gastos por categoría'
    })

    const [expensesOverview, setExpensesOverview] = useState({
        chart: {
            daily: {
                onGoing: 13,
                finished: 9,
                total: 21,
                series: [
                    {
                        name: 'Gastos',
                        data: [20, 19, 18, 14, 12, 10],
                    },
                    {
                        name: 'Ingresos',
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
                        name: 'Gastos',
                        data: [45, 52, 68, 84, 103, 112, 126],
                    },
                    {
                        name: 'Ingresos',
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
                        name: 'Gastos',
                        data: [28, 52, 91, 154, 227, 256, 270],
                    },
                    {
                        name: 'Ingresos',
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
        return state.salesDashboard?.data.loading;
    })

    const expenseList = useExpenseSelector((state) => state.expense?.data.expenseList)


    useEffect(() => {
        dispatch(getExpenseList())
    }, [])

    useEffect(() => {
        fetchData()
    }, [expenseList])


    const fetchData = () => {
        
        console.log("🚀 ~ fetchData ~ expenseList:", expenseList)
        if(expenseList){
            const groupedData: any = expenseList.reduce((acc: any, item: any) => {
                const { category_name, amount } = item;
    
                if (!acc[category_name]) {
                    acc[category_name] = {
                        category_name: category_name,
                        amount: 0,
                    };
                }
    
                acc[category_name].amount += amount;
    
                return acc;
            }, {});
    
            const dataProcesada = Object.values(groupedData);

            let labels: string[] = [];
            let values: number[] = [];
            let totalExpenses: number = 0;

            dataProcesada.map((data: any) =>{
                labels.push(data.category_name)
                values.push(data.amount)
                totalExpenses+= data.amount
            })
            
            console.log("🚀 ~ dataProcesada.map ~ totalExpenses:", totalExpenses)
            
            setCategories({labels: labels, data: values, title: expensesCategories.title})
        
            setStatistics((data) => {
                data.expenses.value = totalExpenses
                return data;
            })
        }

        // dispatch(setStartDate(1720483615))
    }

    

    return (
        <div className="flex flex-col gap-4 h-full">
            <Loading loading={loading}>
                <DashboardHeader></DashboardHeader>
                <DashboardHeaderButtons></DashboardHeaderButtons>
                <Statistic data={statistics} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <BarChartDouble
                        data={expensesOverview}
                        className="col-span-2"
                        title="Movimientos"
                    />
                    <SimpleDountChart
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