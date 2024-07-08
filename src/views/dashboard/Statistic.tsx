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
        revenue?: {
            value: number
            growShrink: number
        }
        orders?: {
            value: number
            growShrink: number
        }
        purchases?: {
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
                    <p>
                        3 meses atrás, desde{' '}
                        <span className="font-semibold">
                        
                            {dayjs(new Date(date * 1000)).format('DD-MM-YYYY')}
                        </span>
                    </p>
                </div>
                <GrowShrinkTag value={data.growShrink} suffix="%" />
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
                data={data.revenue}
                valuePrefix="$"
                label="Gastos"
                date={startDate}
            />
            <StatisticCard data={data.orders} valuePrefix="$" label="Ingresos" date={startDate} />
            <StatisticCard
                data={data.purchases}
                valuePrefix="$"
                label="Ahorro"
                date={startDate}
            />
        </div>
    )
}

export default Statistic
