import Loading from "@/components/shared/Loading";
import { useEffect, useState } from "react";

import SimpleDountChart from "../components/Charts/SimpleDonutChart";
import BarChartDouble, { BarChartDoubleProps } from "../components/Charts/BarChartDouble";

import Statistic from './Statistic'
import TopProduct from "./TopProduct";
import LatestOrder from "./LatestOrder";
import DashboardHeader from "./dashboardHeader";
import DashboardHeaderButtons from "./dashboardHeaderButtons";

import { injectReducer, useAppDispatch } from '@/store'
import { getSalesDashboardData, useAppSelector } from "./store";
import reducer, { getExpenseList, useAppSelector as useExpenseSelector } from "../expenses/store";
import incomeReducer, { getIncomesList, useAppSelector as useIncomeSelector } from "../incomes/store";
import { iCategories } from "@/utils/interfaces/categories.interface";

injectReducer('expense', reducer)
injectReducer('income', incomeReducer)

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

    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalIncomes, setTotalIncomes] = useState(0);
    const [firstLoad, setFirstLoad] = useState(false);

    const [overview, setOverview] = useState<any>()

    const dispatch = useAppDispatch()

    const dashboardData = useAppSelector(
        (state) => {
            return state.salesDashboard?.data.dashboardData
        }
    )

    const loading = useAppSelector((state) => {
        return state.salesDashboard?.data.loading;
    })

    const expenseList = useExpenseSelector((state) => state.expense?.data.expenseList)
    const incomeList = useIncomeSelector((state) => state.income?.data.incomesList)

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getExpenseList());
            await dispatch(getIncomesList());
            setFirstLoad(true);
        };

        fetchData();
    }, [dispatch])

    useEffect(() => {
        fetchExpenses()
    }, [expenseList])

    useEffect(() => {
        fetchIncomes();
    }, [incomeList])

    useEffect(() => {
        if (expenseList && incomeList && firstLoad) {
            setOverviewData();
        }
    }, [expenseList, incomeList]);


    const fetchExpenses = () => {
        console.log("🚀 ~ fetchData ~ expenseList:", expenseList)
        if (expenseList) {
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

            dataProcesada.map((data: any) => {
                labels.push(data.category_name)
                values.push(data.amount)
                totalExpenses += data.amount
            })

            console.log("🚀 ~ dataProcesada.map ~ totalExpenses:", totalExpenses)

            setTotalExpenses(totalExpenses)
            setCategories({ labels: labels, data: values, title: expensesCategories.title })

            setStatistics((data) => {
                data.expenses.value = totalExpenses
                return data;
            })
        }
    }

    const fetchIncomes = () => {
        if (incomeList) {
            let total = 0;
            incomeList.map((income) => {
                total += income.amount
            })

            console.log("🚀 ~ fetchIncomes ~ total:", total)
            setTotalIncomes(total);

            setStatistics((data) => {
                data.incomes.value = total
                return data;
            })
        }
    }

    const setOverviewData = () => {
        let expenseDates: any[] = [];
        const expenseData = expenseList.map((expense) => {
            expenseDates.push(expense.date)
            return expense.amount
        });
        
        let incomesDates: any[] = [];
        const incomeData = incomeList.map((income) => {
            incomesDates.push(income.date)
            return income.amount
        })
        
        console.log("🚀 ~ setOverviewData ~ expenseDates:", expenseDates)
        console.log("🚀 ~ setOverviewData ~ incomesDates:", incomesDates)

        const newOverview = {
            chart: {
                daily: {
                    expenses: 13,
                    incomes: 9,
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
                    expenses: 126,
                    incomes: 87,
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
                    expenses: totalExpenses,
                    incomes: totalIncomes,
                    total: totalExpenses + totalIncomes,
                    series: [
                        {
                            name: 'Gastos',
                            data: expenseData
                        },
                        {
                            name: 'Ingresos',
                            data: incomeData
                        }
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
                }
            },
        }

        console.log("🚀 ~ setOverviewData ~ newOverview:", newOverview)

        setOverview(newOverview);
        setFirstLoad(false);
    }


    return (
        <div className="flex flex-col gap-4 h-full">
            <Loading loading={loading}>
                <DashboardHeader></DashboardHeader>
                {/* <DashboardHeaderButtons></DashboardHeaderButtons> */}
                <Statistic data={statistics} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <BarChartDouble
                        data={overview}
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