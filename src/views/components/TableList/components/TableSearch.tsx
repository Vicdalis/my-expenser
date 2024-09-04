import { useRef, useState } from 'react'
import Input from '@/components/ui/Input'
import { HiOutlineSearch } from 'react-icons/hi'
import {
    // getProducts,
    setTableData,
    useAppSelector,
    useAppDispatch,
} from '../store'
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'
import type { TableQueries } from '@/@types/common'
import type { ChangeEvent } from 'react'

const TableSearch = (getData : any) => {

    const dispatch = useAppDispatch()

    const searchInput = useRef(null)

    const debounceFn = debounce(handleDebounceFn, 500)

    function handleDebounceFn(val: string) {
        console.log("🚀 ~ handleDebounceFn ~ val:", val)
        // const newTableData = cloneDeep(tableData)
        // newTableData.query = val
        // newTableData.pageIndex = 1
        // console.log("🚀 ~ handleDebounceFn ~ newTableData:", newTableData)
        // if (typeof val === 'string' && val.length > 1) {
        //     fetchData(newTableData)
        // }

        // if (typeof val === 'string' && val.length === 0) {
        //     fetchData(newTableData) 
        // }

        if (typeof val === 'string' && (val.length > 1 || val.length === 0)) {
            setTableData((prevData: any) => ({
                ...prevData,
                ...{ query: val, pageIndex: 1 },
            }))
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }

    const fetchData = (data: TableQueries) => {
        
        // dispatch(setTableData(data))
        dispatch(getData(data))
    }

    const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
        console.log("🚀 ~ onEdit ~ e.target.value:", e.target.value)
        debounceFn(e.target.value)
    }

    return (
        <Input
            ref={searchInput}
            className="max-w-md md:w-52 md:mb-0 mb-4"
            size="sm"
            placeholder="Buscar..."
            prefix={<HiOutlineSearch className="text-lg" />}
            onChange={handleChange}
        />
    )
}

export default TableSearch
