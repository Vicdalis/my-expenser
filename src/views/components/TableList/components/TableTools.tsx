import Button from '@/components/ui/Button'
import { HiPlusCircle } from 'react-icons/hi'

interface propsTableTools {
    onAddItem: any,
    getData: any
}

const TableTools = ({ onAddItem, getData }: propsTableTools) => {

    return (
        <div className="flex flex-col lg:flex-row lg:items-center">

            <Button variant="solid" size="sm" icon={<HiPlusCircle />} onClick={onAddItem}>
                Crear Nuevo
            </Button>
        </div>
    )
}

export default TableTools
