import React, { useEffect, useState } from "react";
import Header from "./header";
import SalesByCategories from "../dashboard/SalesByCategories";
import TableComponent from "../components/TableList";
import { setTableData, updateProductList } from "../components/TableList/store";
import ModalComponent from "../components/ModalComponent";
import reducer, { Income, getIncomesList, useAppSelector, useAppDispatch } from "./store";
import ExpenseForm from "./incomesForm";
import { injectReducer, useAppDispatch as useGlobalDispatch } from "@/store";
import ErrorModalComponent from "../components/Modals/ErrorModalComponent";
import { Columns, eTypeColumns } from "../components/TableList/components/ItemsTable";

injectReducer('income', reducer)

const IncomesView = () => {
    const [expensesCategories, setCategories] = useState({
        labels: ['Comida', 'Belleza', 'Gym', 'Salud'],
        data: [351, 246, 144, 83],
    });
    const [openModal, setOpenModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [editingValues, setEditingValues] = useState<Income>();

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

    const onDelete = () => {

    }

    const incomesList = useAppSelector((state) => state.income.data.incomesList)

    useEffect(() => {
        dispatch(getIncomesList());
    }, [dispatch]);

    useEffect(() => {

        if (incomesList === null) {
            setShowErrorModal(true)
        } else {
            globalDispatch(updateProductList(incomesList))

            const groupedData: any = incomesList.reduce((acc: any, item: any) => {
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

    }, [incomesList, globalDispatch])

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
            id: 'status',
            name: 'Estatus',
            key: 'is_active',
            type: eTypeColumns.TEXT_BADGE
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
            <Header />
            <div >
                <TableComponent onDelete={onDelete} getDataOnSearch={[]} columns={columns} onEdit={onEdit} onAddItem={onCreate} deleteMessage={undefined}></TableComponent>
            </div>

            <ModalComponent openModal={openModal} title="Agregar Ingreso" onClose={onClose}>
                <ExpenseForm closeModal={onClose} dataForm={editingValues}></ExpenseForm>
            </ModalComponent>
            {showErrorModal &&
                <ErrorModalComponent openModal={showErrorModal} onCloseModal={() => setShowErrorModal(false)} />
            }
        </React.Fragment>
    )
}

export default IncomesView;