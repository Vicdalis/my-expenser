import Button from "@/components/ui/Button";
import { HiPlusCircle } from "react-icons/hi";
import { MdOutlineSavings } from "react-icons/md";

const DashboardHeaderButtons = () => {

    return(
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                <Button variant="solid" icon={<HiPlusCircle />} size="sm" >
                    Agregar Gastos
                </Button>
                <Button variant="solid" icon={<HiPlusCircle />} size="sm" >
                    Agregar Ingresos
                </Button>
            </div>
    )
}

export default DashboardHeaderButtons;