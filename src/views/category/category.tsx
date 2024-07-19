import { useState } from "react";
import HeaderComponent from "../components/HeaderComponent";
import ModalComponent from "../components/ModalComponent";
import TableComponent from "../components/TableList";
import CategoryForm from "./CategoryForm";

const CategoryView = () =>{
    const [openModal, setOpenModal] = useState(false);

    const onCreate = () =>{
        console.log('CREANDO ITEM ')
        setOpenModal(true);
    }

    const onClose = () => {
        console.log('CERRANDO POPUP')
        setOpenModal(false);
    }
    
    return (
        <div>
            <HeaderComponent title="Categorías" subtitle="Administra tus categorías de gastos" />
            <TableComponent onAddItem={onCreate} deleteMessage={undefined}></TableComponent>
            <ModalComponent openModal={openModal} title="Nueva Categoría" onClose={onClose}>
                <CategoryForm></CategoryForm>
            </ModalComponent>
        </div>
    )
}

export default CategoryView;