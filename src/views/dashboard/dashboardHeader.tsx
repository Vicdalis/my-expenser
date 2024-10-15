import DatePicker from '@/components/ui/DatePicker'
import Button from '@/components/ui/Button'
import {
    setStartDate,
    setEndDate,
    getSalesDashboardData,
    useAppSelector,
    useAppDispatch as useDashboardDispatch
} from './store'
 import { HiOutlineFilter } from 'react-icons/hi'
import Select from "@/components/ui/Select";
import HeaderComponent from '../components/HeaderComponent'
import { useEffect, useState } from 'react'
import moment from 'moment/moment';
import dayjs from 'dayjs'

const dateFormat = 'YYYY-MM-DD'

const { DatePickerRange } = DatePicker

const DashboardHeader = () => {
    moment.locale('es');
    const months = moment.months()

    const dispatch = useDashboardDispatch()

    const monthOptions: {value: string, label:string}[]  = months.map((month: string) => {
        return {value: month, label: month}
    });
    const [defaultMonth, setDefaultMonth] = useState<{value: string, label:string}>();
    const [defaultYear, setDefaultYear] = useState<{value: string, label:string}>();


    // const startDate = useAppSelector(
    //     (state) => state.salesDashboard?.data.startDate
    // )
    // const endDate = useAppSelector((state) => state.salesDashboard?.data.endDate)

    const handleDateChange = (month: {value: string, label:string}, year: {value: string, label:string}) => {
        let newStartDate = new Date(month.value + '/' + year.label);
        console.log("🚀 ~ handleDateChange ~ newStartDate:", newStartDate)
        
        let newEndDate: string = moment(newStartDate).endOf('months').format(dateFormat)
        
        let formattedStartDate: string = moment(newStartDate).format(dateFormat)
        console.log("🚀 ~ handleDateChange ~ formattedStartDate:", formattedStartDate)

        dispatch(setStartDate(formattedStartDate))
        dispatch(setEndDate(newEndDate))
    }


    const onFilter = () => {
        dispatch(getSalesDashboardData())
    }

    const yearOptions = [
        { value: '2024', label: '2024' },
        { value: '2023', label: '2023' },
        { value: '2022', label: '2022' },
    ]

    useEffect(()=>{
        console.log('AQUI VOY? ')
        let currentMonth = moment().format('MMMM');
        let foundedMonth = monthOptions.find((month) => month.label === currentMonth)
        setDefaultMonth(foundedMonth ?? monthOptions[0]);

        let currentYear = moment().format('YYYY');
        let foundedYear = yearOptions.find((year) => year.label === currentYear);
        setDefaultYear(foundedYear ?? yearOptions[0]);

        // let newStartDate = new Date(foundedMonth?.value + '/' + foundedYear?.value);
        // dispatch(setStartDate(moment(newStartDate).format(dateFormat)))

        // let newEndDate = moment(newStartDate).endOf('months').format(dateFormat)
        // dispatch(setEndDate(newEndDate))
    }, [])

    return (
            <HeaderComponent title='Inicio' subtitle='Resumen de Gastos'>
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    <Select
                        placeholder="Elija un Mes"
                        options={monthOptions}
                        value={defaultMonth}
                        onChange={(newValue) => {
                            if(newValue){
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
                            if(newValue){
                                setDefaultYear(newValue)
                                handleDateChange(defaultMonth ?? monthOptions[0], newValue)
                            }
                        }}
                    ></Select>
                    <Button size="sm" icon={<HiOutlineFilter />} onClick={onFilter}>
                        Filter
                    </Button>
                </div>
            </HeaderComponent>
    )
}

export default DashboardHeader
