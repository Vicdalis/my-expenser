import { useEffect, useState } from "react";

import SimpleDountChart from "../components/Charts/SimpleDonutChart";
import BarChartDouble from "../components/Charts/BarChartDouble";

import Statistic from './Statistic'
import DashboardHeader from "./dashboardHeader";

import { injectReducer, useAppDispatch } from '@/store'
import dashboardReducer, { useAppSelector as useDashboardSelector } from "./store";
import reducer, { getExpenseByDate, getExpenseList, useAppSelector as useExpenseSelector } from "../expenses/store";
import incomeReducer, { getIncomesList, getIncomesListByDate, Income, useAppSelector as useIncomeSelector } from "../incomes/store";
import { iCategories } from "@/utils/interfaces/categories.interface";
import dayjs from "dayjs";
import categoriesReducer, { getCategoryList, useAppSelector as useCategorySelector,  } from "../category/store";
import { theme } from "twin.macro";
import moment from "moment";

injectReducer('expense', reducer)
injectReducer('income', incomeReducer)
injectReducer('expenseList', reducer)
injectReducer('incomesList', reducer)
injectReducer('salesDashboard', dashboardReducer)
injectReducer('categories', categoriesReducer)

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
        colors: [],
        title: 'Gastos por categoría'
    })

    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalIncomes, setTotalIncomes] = useState(0);
    const [firstLoad, setFirstLoad] = useState(false);

    const [overview, setOverview] = useState<any>()

    const dispatch = useAppDispatch()

    const dashboardData = useDashboardSelector(
        (state) => {
            return state.salesDashboard?.data
        }
    )

    const expenseList = useExpenseSelector((state) => state.expense?.data.expenseByDate)
    const expensesByYear = useExpenseSelector((state) => state.expense?.data.expenseList)

    const incomeList = useIncomeSelector((state) => state.income?.data.icomeListByDate)
    const incomesByYear = useIncomeSelector((state) => state.income?.data.incomesList)

    const categories = useCategorySelector((state) => state.categories?.data.categoryList)

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getExpenseByDate({startdate: dashboardData.startDate, endDate: dashboardData.endDate}));
            await dispatch(getIncomesListByDate({startdate: dashboardData.startDate, endDate: dashboardData.endDate}));
            await dispatch(getCategoryList())
            await dispatch(getExpenseList())
            await dispatch(getIncomesList())
        };

        fetchData();
    }, [dashboardData.startDate, dashboardData.endDate])

    useEffect(() => {
        fetchExpenses()
    }, [expenseList])

    useEffect(() => {
        fetchIncomes();
    }, [incomeList])

    useEffect(() => {
        if (expenseList && incomeList ) {
            setOverviewData();
        }
    }, [expenseList, incomeList]);


    const fetchExpenses = () => {
        
        if (expenseList) { 
            const groupedData: any = expenseList.reduce((acc: any, item: any) => {
                const { category_name, amount, category_id } = item;

                if (!acc[category_name]) {
                    acc[category_name] = {
                        category_name: category_name,
                        amount: 0,
                        category_id: category_id
                    };
                }

                acc[category_name].amount += amount;

                return acc;
            }, {});

            const dataProcesada = Object.values(groupedData);

            let labels: string[] = [];
            let values: number[] = [];
            let colors: string[] = [];
            let totalExpenses: number = 0;
            
            dataProcesada.forEach((data: any) => {
                labels.push(data.category_name)
                values.push(data.amount)
                let founded = categories.find((category) => category.id === data.category_id)
                colors.push(founded?.color ?? '')
                // theme('colors.')
                totalExpenses += data.amount
            })

            setTotalExpenses(totalExpenses)
            setCategories({ labels: labels, colors: colors, data: values, title: expensesCategories.title })

            setStatistics((data) => {
                data.expenses.value = totalExpenses
                return data;
            })
        }else{
            setTotalExpenses(0);
            setCategories({
                labels: [],
                data: [],
                colors: [],
                title: 'Gastos por categoría'
            })
            setStatistics((data) => {
                data.expenses.value = 0
                return data;
            })
        }
    }

    const fetchIncomes = () => {
        if (incomeList) {
            let total = 0;
            incomeList.forEach((income) => {
                total += income.amount
            })

            setTotalIncomes(total);

            setStatistics((data) => {
                data.incomes.value = total
                return data;
            })
        }
    }

    const setOverviewData = () => {
        let incomeData: { [key: string] : number} = {};
        let expenseData: { [key: string] : number} = {};
        let months: {income: { [key: string] : number}, expense: { [key: string] : number}} = {income: {}, expense: {}}

        let dates =  new Set<string>()
        
        expenseList.forEach((expense) => {
            let mydate = dayjs(new Date(expense.date!.toString())).format('YYYY-MM-DD')
            dates.add(mydate)
        })
        
        incomeList.forEach((income) => {
            let mydate = dayjs(new Date(income.date!.toString())).format('YYYY-MM-DD')
            dates.add(mydate)
        })
        
        let allDates = Array.from(dates)
        .sort((a, b) => {
            let dateA = new Date(a.toString()).getTime() 
            let dateB = new Date(b.toString()).getTime()
            return dateA > dateB ? 1 : -1;
        })
        allDates.forEach((myDate) => {
            let filteredIncome = incomeList.filter((income) => dayjs(new Date(income.date!.toString())).format('YYYY-MM-DD') === myDate);
            let amount = 0;
            filteredIncome.forEach((filteredIncome) => {
                amount += filteredIncome.amount; 
            })
            incomeData[myDate] = amount;

            let filteredExpense = expenseList.filter((income) => dayjs(new Date(income.date!.toString())).format('YYYY-MM-DD') === myDate);
            let expenseAmount = 0;
            filteredExpense.forEach((filteredExpense) => {
                expenseAmount += filteredExpense.amount; 
            })
            expenseData[myDate] = expenseAmount;
        })
        
        expensesByYear.forEach((yearExpenses) => {
            let mymonth = dayjs(new Date(yearExpenses.date!.toString())).format('MMM')
            months.expense[mymonth] = months.expense[mymonth] ?? 0 + yearExpenses.amount;
        })
        
        console.log("🚀 ~ expensesByYear.forEach ~ expensesByYear:", expensesByYear)

        incomesByYear.forEach((yearIncomes) => {
            let mymonth = dayjs(new Date(yearIncomes.date!.toString())).format('MMM')
            months.income[mymonth] = (months.income[mymonth] ?? 0) + yearIncomes.amount;
        })
    
        
        let dailyExpenses = { data: Object.values(expenseData), total: Object.values(expenseData).reduce((a: any, b: any) => a + b, 0)};
        let dailyIncomes = { data: Object.values(incomeData), total: Object.values(incomeData).reduce((a: any, b: any) => a + b, 0)};
        let monthlyDates = [...new Set([...Object.keys(months.expense), ...Object.keys(months.income)])]
        console.log("🚀 ~ setOverviewData ~ monthlyDates:", monthlyDates)
        

        const newOverview = {
            chart: {
                daily: {
                    expenses: dailyExpenses.total,
                    incomes: dailyIncomes.total,
                    total: (dailyExpenses.total as number) + (dailyIncomes.total as number),
                    series: [
                        {
                            name: 'Gastos',
                            data: dailyExpenses.data,
                        },
                        {
                            name: 'Ingresos',
                            data: dailyIncomes.data,
                        },
                    ],
                    range: allDates.map((date) => {
                        return dayjs(date, 'YYYY-MM-DD').format('DD-MM')
                    }),
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
                            data: Object.values(months.expense)
                        },
                        {
                            name: 'Ingresos',
                            data: Object.values(months.income)
                        }
                    ],
                    range: monthlyDates,
                }
            },
        }

        setOverview(newOverview);
        setFirstLoad(false);
    }


    return (
        <div className="flex flex-col gap-4 h-full">
                <DashboardHeader></DashboardHeader>
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
        </div>
    )
}

export default DashboardComponent;