import React, { useState } from "react";
import Select from "@/components/ui/Select";
import DatePickerRange from "@/components/ui/DatePicker/DatePickerRange";
import dayjs from "dayjs";
import HeaderComponent from "../components/HeaderComponent";


const HeaderExpenses = () => {

    const monthOptions = [
        { value: 'ocean', label: 'Hoy', color: '#00B8D9' },
        { value: 'blue', label: 'Semana', color: '#0052CC' },
        { value: 'purple', label: 'Mes Actual', color: '#5243AA' },
        { value: 'red', label: 'Periodo', color: '#FF5630' },
    ]

    const handleDateChange = (value: [Date | null, Date | null]) => {
       
    }
    
    return (
        <div>
            <HeaderComponent title="Gastos" subtitle="Historial de Gastos"> 
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    <p className="m-3">Filtrar por: </p>
                    <Select
                        className="min-w-32"
                        placeholder="Elija un Mes"
                        options={monthOptions}
                        defaultValue={monthOptions[0]}
                    ></Select>
                    <DatePickerRange
                        value={[
                            dayjs.unix(1720567444).toDate(),
                            dayjs.unix(1720740244).toDate(),
                        ]}
                        inputFormat={'MMM DD, YYYY'}
                        size="sm"
                        onChange={handleDateChange}
                        className="w-64"
                    />
                </div>
            </HeaderComponent>
        </div>
    )
}

export default HeaderExpenses;