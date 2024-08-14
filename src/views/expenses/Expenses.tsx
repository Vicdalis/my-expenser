import React, { useEffect, useState } from "react";
import HeaderExpenses from "./HeaderExpenses";
import SalesByCategories from "../dashboard/SalesByCategories";
import TableComponent from "../components/TableList";
import { setTableData } from "../components/TableList/store";
import ModalComponent from "../components/ModalComponent";
import reducer, { Expense, getExpenseList, useAppSelector, useAppDispatch } from "./store";
import ExpenseForm from "./ExpenseForm";
import { injectReducer } from "@/store";
import ErrorModalComponent from "../components/Modals/ErrorModalComponent";
import { Columns, eTypeColumns } from "../components/TableList/components/ItemsTable";

injectReducer('expense', reducer)

const ExpensesView = () => {
    const [expensesCategories, setCategories] = useState({
        labels: ['Comida', 'Belleza', 'Gym', 'Salud'],
        data: [351, 246, 144, 83],
    });
    const [openModal, setOpenModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [editingValues, setEditingValues] = useState<Expense>()

    const dispatch = useAppDispatch()

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

    useEffect(() => {   
        dispatch(getExpenseList()).then((result) => {
            console.log("🚀 ~ dispatch ~ result:", result)
            if(result.payload === null){
                setShowErrorModal(true)
            }
        });
    }, [])

    const data = useAppSelector((state) => {
        const dataList = state.expense?.data?.expenseList ?? [];

        setTableData((prevData: any) => ({
            ...prevData,
            ...{ total: dataList.length, pageIndex: 1 },
        }))

        return dataList;
    });

    const columns: Columns[] = [
        { 
            id: 'name',
            name: 'Nombre',
            key: 'description',
            type: eTypeColumns.TEXT
        },{
            id: 'category',
            name: 'Categoría',
            key: 'category_name',
            type: eTypeColumns.TEXT
        },{
            id: 'status',
            name: 'Estatus',
            key: 'is_active',
            type: eTypeColumns.TEXT_BADGE
        },{
            id: 'amount',
            name: 'Monto',
            key: 'amount',
            type: eTypeColumns.CURRENCY
        },{
            id: 'date',
            name: 'Fecha',
            key: 'date',
            type: eTypeColumns.DATE
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
                {showErrorModal && 
                    <ErrorModalComponent openModal={showErrorModal} onCloseModal={ () => setShowErrorModal(false)} />
                }
        </React.Fragment>
    )
}

export default ExpensesView;