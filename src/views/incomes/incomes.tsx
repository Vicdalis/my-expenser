import React, { useEffect, useState } from "react";

import Header from "./header";
import IncomeForm from "./incomesForm";

import { toast } from "@/components/ui";
import Notification from '@/components/ui/Notification'

import TableComponent from "../components/TableList";
import ModalComponent from "../components/ModalComponent";
import { updateProductList } from "../components/TableList/store";
import ErrorModalComponent from "../components/Modals/ErrorModalComponent";
import { Columns, eTypeColumns } from "../components/TableList/components/ItemsTable";

import { injectReducer, useAppDispatch as useGlobalDispatch } from "@/store";
import reducer, { Income, getIncomesList, useAppSelector, useAppDispatch, deleteIncome } from "./store";
import SimpleDountChart from "../components/Charts/SimpleDonutChart";

injectReducer('income', reducer)

interface iCategories{
    labels: string[],
    data: number[],
    title: string
}

const IncomesView = () => {
    const [categories, setCategories] = useState<iCategories>({
        labels: [],
        data: [],
        title: 'Ingresos por Categoría'
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

    const onDelete = async (id: string) => {
        try {
            const result = await dispatch(deleteIncome(id))

            if(result){
                dispatch(getIncomesList());

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
            setShowErrorModal(true)
        }
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

            setCategories({ labels: labels, data: values, title: categories.title });
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
        },{
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
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <SimpleDountChart
                    data={categories}
                />
                <div className="lg:col-span-3">
                    <TableComponent onDelete={onDelete} getDataOnSearch={incomesList} columns={columns} onEdit={onEdit} onAddItem={onCreate} deleteMessage={undefined}></TableComponent>
                
                </div>
            </div>

            <ModalComponent openModal={openModal} title="Agregar Ingreso" onClose={onClose}>
                <IncomeForm closeModal={onClose} dataForm={editingValues}></IncomeForm>
            </ModalComponent>
            {showErrorModal &&
                <ErrorModalComponent openModal={showErrorModal} onCloseModal={() => setShowErrorModal(false)} />
            }
        </React.Fragment>
    )
}

export default IncomesView;