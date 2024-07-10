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
import dayjs from 'dayjs'
import Select from "@/components/ui/Select";
import HeaderComponent from '../components/HeaderComponent'

const dateFormat = 'MMM DD, YYYY'

const { DatePickerRange } = DatePicker

const DashboardHeader = () => {
    const dispatch = useAppDispatch()

    const startDate = useAppSelector(
        (state) => state.salesDashboard?.data.startDate
    )
    const endDate = useAppSelector((state) => state.salesDashboard?.data.endDate)

    const handleDateChange = (value: [Date | null, Date | null]) => {
        dispatch(setStartDate(dayjs(value[0]).unix()))
        dispatch(setEndDate(dayjs(value[1]).unix()))
    }

    const onFilter = () => {
        dispatch(getSalesDashboardData())
    }

    const monthOptions = [
        { value: 'ocean', label: 'Enero', color: '#00B8D9' },
        { value: 'blue', label: 'Febrero', color: '#0052CC' },
        { value: 'purple', label: 'Marzo', color: '#5243AA' },
        { value: 'red', label: 'Abril', color: '#FF5630' },
    ]

    return (
            <HeaderComponent title='Inicio' subtitle='Resumen de Gastos'>
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    <Select
                        placeholder="Elija un Mes"
                        options={monthOptions}
                        defaultValue={monthOptions[0]}
                    ></Select>
                    <Button size="sm" icon={<HiOutlineFilter />} onClick={onFilter}>
                        Filter
                    </Button>
                </div>
            </HeaderComponent>
    )
}

export default DashboardHeader
