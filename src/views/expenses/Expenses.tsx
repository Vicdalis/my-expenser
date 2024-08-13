import React, { useState } from "react";
import HeaderExpenses from "./HeaderExpenses";
import SalesByCategories from "../dashboard/SalesByCategories";
import TableComponent from "../components/TableList";
import { setTableData } from "../components/TableList/store";
import ModalComponent from "../components/ModalComponent";
import { Expense, useAppSelector } from "./store";
import ExpenseForm from "./ExpenseForm";

const ExpensesView = () => {
    const [expensesCategories, setCategories] = useState({
        labels: ['Comida', 'Belleza', 'Gym', 'Salud'],
        data: [351, 246, 144, 83],
    });
    const [openModal, setOpenModal] = useState(false);
    const [editingValues, setEditingValues] = useState<Expense>()

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

    const data = useAppSelector((state) => {
        const dataList = state.expense?.data?.expenseList ?? [];

        setTableData((prevData: any) => ({
            ...prevData,
            ...{ total: dataList.length, pageIndex: 1 },
        }))

        return dataList;
    });

    const columns = [
        { 
            id: 'name',
            name: 'Nombre',
            key: 'name',
            type: 'text'
        },{
            id: 'category',
            name: 'Categoría',
            key: 'type',
            type: 'text_badge'
        },{
            id: 'status',
            name: 'Estatus',
            key: 'is_active',
            type: 'text_badge'
        },{
            id: 'ammount',
            name: 'Monto',
            key: 'ammount',
            type: 'text'
        },{
            id: 'date',
            name: 'Fecha',
            key: 'date',
            type: 'text'
        }
    ];
    
    return (
        <React.Fragment>
                <HeaderExpenses />
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <SalesByCategories
                        data={expensesCategories}
                    />
                    <div className="lg:col-span-3">
                        <TableComponent getDataOnSearch={[]} columns={columns} data={data} onEdit={onEdit} onAddItem={onCreate} deleteMessage={undefined}></TableComponent>
                    </div>
                </div>

                <ModalComponent openModal={openModal} title="Agregar Gasto" onClose={onClose}>
                    <ExpenseForm  closeModal={onClose}></ExpenseForm>
                </ModalComponent>
        </React.Fragment>
    )
}

export default ExpensesView;