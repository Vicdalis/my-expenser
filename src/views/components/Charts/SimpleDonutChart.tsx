import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Chart from '@/components/shared/Chart'
import { COLORS, tailwindColors } from '@/constants/chart.constant'

type SimpleDountChartProps = {
    data?: {
        labels: string[]
        data: number[]
        colors?: string[]
        title: string
    }
}

const SimpleDountChart = ({
    data = { labels: [], colors: [], data: [], title: 'Categorías' },
}: SimpleDountChartProps) => {
    return (
        <Card>
            <h4>{data.title}</h4>
            <div className="mt-6">
                {data.data.length > 0 && (
                    <>
                        <Chart
                            donutTitle={`${data.data.reduce(
                                (a, b) => a + b,
                                0
                            )}$`}
                            donutText="Total"
                            series={data.data}
                            customOptions={{ labels: data.labels, 
                                colors: data.colors?.map((color: string) => {
                                    return tailwindColors[color as keyof typeof tailwindColors]
                                }) 
                            }}
                            type="donut"
                        />
                        {data.data.length === data.labels.length && (
                            <div className="mt-6 grid grid-cols-2 gap-4 max-w-[180px] mx-auto">
                                {data.labels.map((value, index) => (
                                    <div
                                        key={value}
                                        className="flex items-center gap-1"
                                    >
                                        <Badge
                                            className={data.colors ? "bg-" + data.colors[index] + '-500' : ''}
                                            badgeStyle={{
                                                backgroundColor: data.colors ? '' : COLORS[index],
                                            }}
                                        />
                                        <span className="font-semibold">
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </Card>
    )
}

export default SimpleDountChart
