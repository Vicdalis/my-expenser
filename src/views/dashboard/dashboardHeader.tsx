import DatePicker from '@/components/ui/DatePicker'
import Button from '@/components/ui/Button'
import {
    setStartDate,
    setEndDate,
    getSalesDashboardData,
    useAppSelector,
} from './store'
import { useAppDispatch } from '@/store'
import { HiOutlineFilter } from 'react-icons/hi'
import Select from "@/components/ui/Select";
import HeaderComponent from '../components/HeaderComponent'
import { useEffect, useState } from 'react'
import moment from 'moment/moment';

const dateFormat = 'MMM DD, YYYY'

const { DatePickerRange } = DatePicker

const DashboardHeader = () => {
    moment.locale('es');
    const months = moment.months()

    const dispatch = useAppDispatch()

    const monthOptions: {value: string, label:string}[]  = months.map((month: string) => {
        return {value: month, label: month}
    });
    const [defaultMonth, setDefaultMonth] = useState<{value: string, label:string}>();
    const [defaultYear, setDefaultYear] = useState<{value: string, label:string}>();


    // const startDate = useAppSelector(
    //     (state) => state.salesDashboard?.data.startDate
    // )
    // const endDate = useAppSelector((state) => state.salesDashboard?.data.endDate)

    // const handleDateChange = (value: [Date | null, Date | null]) => {
    //     dispatch(setStartDate(dayjs(value[0]).unix()))
    //     dispatch(setEndDate(dayjs(value[1]).unix()))
    // }


    const onFilter = () => {
        dispatch(getSalesDashboardData())
    }

    const yearOptions = [
        { value: '2024', label: '2024' },
        { value: '2023', label: '2023' },
        { value: '2022', label: '2022' },
    ]

    useEffect(()=>{
        let currentMonth = moment().format('MMMM');
        let foundedMonth = monthOptions.find((month) => month.label === currentMonth)
        console.log("🚀 ~ useEffect ~ foundedMonth:", foundedMonth)
        setDefaultMonth(foundedMonth ?? monthOptions[0]);

        let currentYear = moment().format('YYYY');
        let foundedYear = yearOptions.find((year) => year.label === currentYear);
        console.log("🚀 ~ useEffect ~ foundedYear:", foundedYear)
        setDefaultYear(foundedYear ?? yearOptions[0]);

    }, [])

    return (
            <HeaderComponent title='Inicio' subtitle='Resumen de Gastos'>
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    <Select
                        placeholder="Elija un Mes"
                        options={monthOptions}
                        value={defaultMonth}
                    ></Select>
                    <Select 
                        placeholder="Elija un Año"
                        options={yearOptions}
                        value={defaultYear}
                    ></Select>
                    <Button size="sm" icon={<HiOutlineFilter />} onClick={onFilter}>
                        Filter
                    </Button>
                </div>
            </HeaderComponent>
    )
}

export default DashboardHeader
