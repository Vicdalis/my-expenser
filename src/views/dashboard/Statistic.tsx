import Card from '@/components/ui/Card'
import { NumericFormat } from 'react-number-format'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
// import { useAppSelector } from '@/store'
import dayjs from 'dayjs'
import { useAppSelector } from './store'

type StatisticCardProps = {
    data?: {
        value: number
        growShrink: number
    }
    label: string
    valuePrefix?: string
    date: number
}

type StatisticProps = {
    data?: {
        expenses?: {
            value: number
            growShrink: number
        }
        incomes?: {
            value: number
            growShrink: number
        }
        savings?: {
            value: number
            growShrink: number
        }
    }
}

const StatisticCard = ({
    data = { value: 0, growShrink: 0 },
    label,
    valuePrefix,
    date,
}: StatisticCardProps) => {

    return (
        <Card>
            <h6 className="font-semibold mb-4 text-sm">{label}</h6>
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-bold">
                        <NumericFormat
                            thousandSeparator
                            displayType="text"
                            value={data.value}
                            prefix={valuePrefix}
                        />
                    </h3>
                </div>
            </div>
        </Card>
    )
}

const Statistic = ({ data = {} }: StatisticProps) => {
    const startDate = dayjs(
        dayjs().subtract(3, 'months').format('MM-DD-YYYY')
    ).unix()
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <StatisticCard
                data={data.expenses}
                valuePrefix="$"
                label="Gastos"
                date={startDate}
            />
            <StatisticCard data={data.incomes} valuePrefix="$" label="Ingresos" date={startDate} />
            <StatisticCard
                data={data.savings}
                valuePrefix="$"
                label="Ahorro"
                date={startDate}
            />
        </div>
    )
}

export default Statistic
