import React, { useEffect, useState } from "react";
import HeaderExpenses from "./HeaderExpenses";
import SalesByCategories from "../dashboard/SalesByCategories";
import TableComponent from "../components/TableList";
import { setTableData, updateProductList } from "../components/TableList/store";
import ModalComponent from "../components/ModalComponent";
import reducer, { Expense, getExpenseList, useAppSelector, useAppDispatch, deleteExpense } from "./store";
import ExpenseForm from "./ExpenseForm";
import { injectReducer, useAppDispatch as useGlobalDispatch } from "@/store";
import ErrorModalComponent from "../components/Modals/ErrorModalComponent";
import { Columns, eTypeColumns } from "../components/TableList/components/ItemsTable";
import { toast } from "@/components/ui";
import Notification from '@/components/ui/Notification'

injectReducer('expense', reducer)

const ExpensesView = () => {
    const [expensesCategories, setCategories] = useState({
        labels: ['Comida', 'Belleza', 'Gym', 'Salud'],
        data: [351, 246, 144, 83],
    });
    const [openModal, setOpenModal] = useState(false);
    const [contentErrorModal, setContentErrorModal] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [editingValues, setEditingValues] = useState<Expense>();

    const dispatch = useAppDispatch();
    const globalDispatch = useGlobalDispatch();

    const onCreate = () => {
        setOpenModal(true);
    }

    const onClose = () => {
        setOpenModal(false);
        setEditingValues(undefined)
    }

    const onEdit = (row: any) => {
        setOpenModal(true);
        setEditingValues(row)
    }

    const onDelete = async (id: string) => {
        try {
            const result = await dispatch(deleteExpense(id))

            if(result){
                toast.push(
                    <Notification
                        title={'¡Eliminado!'}
                        type="success"
                        duration={2500}
                    >
                        Eliminado exitosamente!
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            }
        } catch (error) {
            console.error(error);
            setContentErrorModal('Ha ocurrido un error eliminando el registro')
            setShowErrorModal(true)
        }
    }

    const expenseList = useAppSelector((state) => state.expense.data.expenseList)

    useEffect(() => {
        dispatch(getExpenseList());
    }, [dispatch]);

    useEffect(() => {

        if (expenseList === null) {
            setContentErrorModal('')
            setShowErrorModal(true)
        } else {
            globalDispatch(updateProductList(expenseList))

            const groupedData: any = expenseList.reduce((acc: any, item: any) => {
                const { category_name, amount } = item;

                if (!acc[category_name]) {
                    acc[category_name] = {
                        category_name: category_name,
                        amount: 0,
                    };
                }

                acc[category_name].amount += amount;

                return acc;
            }, {});

            const dataProcesada = Object.values(groupedData);

            const labels = dataProcesada.map((data: any) => data.category_name);
            const values = dataProcesada.map((data: any) => data.amount);

            setCategories({ labels: labels, data: values });
        }

    }, [expenseList, globalDispatch])

    const columns: Columns[] = [
        {
            id: 'name',
            name: 'Nombre',
            key: 'description',
            type: eTypeColumns.TEXT
        }, {
            id: 'category',
            name: 'Categoría',
            key: 'category_name',
            type: eTypeColumns.TEXT
        }, {
            id: 'amount',
            name: 'Monto',
            key: 'amount',
            type: eTypeColumns.CURRENCY
        }, {
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
                    <TableComponent onDelete={onDelete} getDataOnSearch={[]} columns={columns} onEdit={onEdit} onAddItem={onCreate} deleteMessage={undefined}></TableComponent>
                </div>
            </div>

            <ModalComponent openModal={openModal} title="Agregar Gasto" onClose={onClose}>
                <ExpenseForm closeModal={onClose} dataForm={editingValues}></ExpenseForm>
            </ModalComponent>
            {showErrorModal &&
                <ErrorModalComponent openModal={showErrorModal} content={contentErrorModal} onCloseModal={() => setShowErrorModal(false)} />
            }
        </React.Fragment>
    )
}

export default ExpensesView;