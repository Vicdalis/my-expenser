import Button from '@/components/ui/Button'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import ProductTableSearch from './TableSearch'
import ProductFilter from './TableFilter'
import { Link } from 'react-router-dom'

interface propsTableTools {
    onAddItem: any,
    getData: any
}

const TableTools = ({ onAddItem, getData }: propsTableTools) => {

    return (
        <div className="flex flex-col lg:flex-row lg:items-center">
            <ProductTableSearch getData={getData} />
            <ProductFilter />
            <Link
                download
                className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                to="/data/product-list.csv"
                target="_blank"
            >
                <Button block size="sm" icon={<HiDownload />}>
                    Descargar
                </Button>
            </Link>

            <Button variant="solid" size="sm" icon={<HiPlusCircle />} onClick={onAddItem}>
                Crear Nuevo
            </Button>
        </div>
    )
}

export default TableTools
