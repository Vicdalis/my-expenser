import { useEffect, useState } from "react";
import HeaderComponent from "../components/HeaderComponent";
import ModalComponent from "../components/ModalComponent";
import TableComponent from "../components/TableList";
import CategoryForm from "./CategoryForm";
import reducer, { useAppSelector, useAppDispatch, getList, Category } from "./store";
import { injectReducer } from '@/store'
import { Loading } from "@/components/shared";

injectReducer('category', reducer)

const CategoryView = () => {
    const [openModal, setOpenModal] = useState(false);
    const [editingValues, setEditingValues] = useState<Category>()
    const dispatch = useAppDispatch()

    const onCreate = () => {
        console.log('CREANDO ITEM ')
        setOpenModal(true);
    }

    const onClose = () => {
        console.log('CERRANDO POPUP')
        setOpenModal(false);
        setEditingValues(undefined)
    }

    const onEdit =(row: any) => {
        console.log('EDITANDO  POPUP', row)
        setOpenModal(true);
        setEditingValues(row)
    }

    const loading = useAppSelector(
        (state) => state.category?.data?.loading ?? false
    )

    const data = useAppSelector((state) => state.category?.data?.categoryList ?? [])

    useEffect(() => {   
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
            key: 'is_active',
            type: 'text_badge'
        },{
            id: 'category_color',
            name: 'Color',
            key: 'color',
            type: 'badge'
        }
    ];
    

    return (
        <div>
            {/* <Loading loading={loading} > */}
                <HeaderComponent title="Categorías" subtitle="Administra tus categorías de gastos" />
                <TableComponent getDataOnSearch={getList} columns={columns} data={data} onEdit={onEdit} onAddItem={onCreate} deleteMessage={undefined}></TableComponent>
                <ModalComponent openModal={openModal} title="Nueva Categoría" onClose={onClose}>
                    <CategoryForm dataForm={editingValues} closeModal={onClose}></CategoryForm>
                </ModalComponent>
            {/* </Loading> */}
        </div>
    )
}

export default CategoryView;