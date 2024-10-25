import React, { useEffect, useState } from "react";
import Select from "@/components/ui/Select";
import HeaderComponent from "../components/HeaderComponent";
import moment from 'moment'
import { useAppDispatch } from "./store";
import { setSelectedDate } from "./store/expensesSlice";
import { DATE_FORMAT } from "@/constants/app.constant";
const HeaderExpenses = () => {

    moment.locale('es');
    const months = moment.months()

    const dispatch = useAppDispatch()

    const monthOptions: { value: string, label: string }[] = months.map((month: string) => {
        return { value: month, label: month }
    });
    const [defaultMonth, setDefaultMonth] = useState<{ value: string, label: string }>();
    const [defaultYear, setDefaultYear] = useState<{ value: string, label: string }>();

    const yearOptions = [
        { value: '2024', label: '2024' },
        { value: '2023', label: '2023' },
        { value: '2022', label: '2022' },
    ]

    const handleDateChange = (month: { value: string, label: string }, year: { value: string, label: string }) => {
        console.log("🚀 ~ handleDateChange ~ month.value + '/' + year.label:", month.value + '/' + year.label)
        let newStartDate = new Date(month.value + '/' + year.label);
        console.log(newStartDate)
        dispatch(setSelectedDate(moment(newStartDate).format('MMMM/YYYY')))
    }

    useEffect(() => {
        console.log('AQUI VOY? ')
        let currentMonth = moment().format('MMMM');
        let foundedMonth = monthOptions.find((month) => month.label === currentMonth)
        setDefaultMonth(foundedMonth ?? monthOptions[0]);

        let currentYear = moment().format('YYYY');
        let foundedYear = yearOptions.find((year) => year.label === currentYear);
        setDefaultYear(foundedYear ?? yearOptions[0]);

        let defaultDate = moment().format('MMMM/YYYY');
        console.log("🚀 ~ useEffect ~ defaultMonth:", defaultDate)

        dispatch(setSelectedDate(defaultDate))

    }, [])

    return (
        <div>
            <HeaderComponent title="Gastos" subtitle="Historial de Gastos">

                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    <Select
                        placeholder="Elija un Mes"
                        options={monthOptions}
                        value={defaultMonth}
                        onChange={(newValue) => {
                            if (newValue) {
                                setDefaultMonth(newValue)
                                handleDateChange(newValue, defaultYear ?? yearOptions[0])
                            }
                        }}
                    ></Select>
                    <Select
                        placeholder="Elija un Año"
                        options={yearOptions}
                        value={defaultYear}
                        onChange={(newValue) => {
                            if (newValue) {
                                setDefaultYear(newValue)
                                handleDateChange(defaultMonth ?? monthOptions[0], newValue)
                            }
                        }}
                    ></Select>
                </div>

            </HeaderComponent>
        </div>
    )
}

export default HeaderExpenses;