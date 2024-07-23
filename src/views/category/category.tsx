import { useEffect, useState } from "react";
import HeaderComponent from "../components/HeaderComponent";
import ModalComponent from "../components/ModalComponent";
import TableComponent from "../components/TableList";
import CategoryForm from "./CategoryForm";
import reducer, { useAppSelector, useAppDispatch, getList } from "./store";
import { injectReducer } from '@/store'
import { Loading } from "@/components/shared";

injectReducer('category', reducer)

const CategoryView = () => {
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useAppDispatch()

    const onCreate = () => {
        console.log('CREANDO ITEM ')
        setOpenModal(true);
    }

    const onClose = () => {
        console.log('CERRANDO POPUP')
        setOpenModal(false);
    }

    const loading = useAppSelector(
        (state) => state.category?.data?.loading ?? false
    )

    const data = useAppSelector((state) => state.category?.data?.categoryList ?? [])

    useEffect(() => {
        console.log("🚀 ~ CategoryView ~ data:", data)
        dispatch(getList());
    }, [])

    const columns = [
    { 
        id: 'category_name',
        name: 'Nombre',
        key: 'name',
        type: 'text_image'
    },{
        id: 'category_type',
        name: 'Tipo',
        key: 'type',
        type: 'text'
    },{
        id: 'category_status',
        name: 'Estatus',
        key: 'status',
        type: 'text_badge'
    },{
        id: 'category_color',
        name: 'Color',
        key: 'color',
        type: 'badge'
    }, {
        id: 'category_icon',
        name: 'Icono',
        key: 'icon',
        type: 'text'
    }];
    

    return (
        <div>
            {/* <Loading loading={loading} > */}
                <HeaderComponent title="Categorías" subtitle="Administra tus categorías de gastos" />
                <TableComponent columns={columns} data={data} onAddItem={onCreate} deleteMessage={undefined}></TableComponent>
                <ModalComponent openModal={openModal} title="Nueva Categoría" onClose={onClose}>
                    <CategoryForm closeModal={onClose}></CategoryForm>
                </ModalComponent>
            {/* </Loading> */}
        </div>
    )
}

export default CategoryView;