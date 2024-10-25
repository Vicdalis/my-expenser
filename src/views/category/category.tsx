import { useEffect, useState } from "react";
import HeaderComponent from "../components/HeaderComponent";
import ModalComponent from "../components/ModalComponent";
import TableComponent from "../components/TableList";
import CategoryForm from "./CategoryForm";
import categoriesReducer, { useAppSelector, useAppDispatch, getCategoryList, Category } from "./store";
import { injectReducer, useAppDispatch as useGlobalDispatch  } from '@/store'
import { Loading } from "@/components/shared";
import { updateProductList } from "../components/TableList/store";

injectReducer('categories', categoriesReducer)

interface iCategories{
    labels: string[],
    data: number[]
}

const CategoryView = () => {
    const [openModal, setOpenModal] = useState(false);
    const [editingValues, setEditingValues] = useState<Category>()
    // const [categoriesList, setCategoriesList] = useState<iCategories>();

    const dispatch = useAppDispatch();
    const globalDispatch = useGlobalDispatch();

    const onCreate = () => {
        setOpenModal(true);
    }

    const onClose = () => {
        setOpenModal(false);
        setEditingValues(undefined)
    }

    const onEdit =(row: any) => {
        console.log('EDITANDO  POPUP', row)
        setOpenModal(true);
        setEditingValues(row)
    }

    const onDelete = () => {

    }

    const categoriesList = useAppSelector((state) => state.categories.data.categoryList)

    useEffect(() => {   
        dispatch(getCategoryList());
    }, [dispatch])

    useEffect(() => {
        if (categoriesList === null) {
            
        }else{
            globalDispatch(updateProductList(categoriesList))
        }

    }, [categoriesList, globalDispatch])

    const columns = [
        { 
            id: 'category_name',
            name: 'Nombre',
            key: 'name',
            type: 'text_image'
        },{
            id: 'category_color',
            name: 'Color',
            key: 'color',
            type: 'badge'
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
        }
    ];
    

    return (
        <div>
            {/* <Loading loading={loading} > */}
                <HeaderComponent title="Categorías" subtitle="Administra tus categorías de gastos" />
                <TableComponent onDelete={onDelete} getDataOnSearch={categoriesList} columns={columns} onEdit={onEdit} onAddItem={onCreate} deleteMessage={undefined}></TableComponent>
                <ModalComponent openModal={openModal} title="Nueva Categoría" onClose={onClose}>
                    <CategoryForm dataForm={editingValues} closeModal={onClose}></CategoryForm>
                </ModalComponent>
            {/* </Loading> */}
        </div>
    )
}

export default CategoryView;