import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Table from './components/ItemsTable'
import ProductTableTools from './components/TableTools'

injectReducer('salesProductList', reducer)

interface tableProps {
    onAddItem: any,
    deleteMessage: string | undefined
}

const TableComponent = (props: tableProps) => {
    return (
        <AdaptableCard className="h-full " bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0"></h3>
                <ProductTableTools  onAddItem={props.onAddItem} />
            </div>
            <Table deleteMessage={props.deleteMessage ? props.deleteMessage : '¿Está seguro de que desea eliminar este registro?'} />
        </AdaptableCard>
    )
}

export default TableComponent
