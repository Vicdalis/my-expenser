import { useEffect, useMemo, useRef } from 'react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import DataTable from '@/components/shared/DataTable'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { FiPackage } from 'react-icons/fi'
import {
    getProducts,
    setTableData,
    setSelectedProduct,
    toggleDeleteConfirmation,
    useAppDispatch,
    useAppSelector,
} from '../store'

import useThemeClass from '@/utils/hooks/useThemeClass'
import DeleteConfirmation from './TableDeleteConfirmation'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import type {
    DataTableResetHandle,
    OnSortParam,
    ColumnDef,
} from '@/components/shared/DataTable'

type Product = {
    id: string
    name: string
    productCode: string
    img: string
    category: string
    price: number
    stock: number
    status: number
}

enum eTypeColumns {
    TEXT = 'text',
    IMAGE = 'image',
    TEXT_IMAGE = 'text_image',
    BADGE = 'badge',
    TEXT_BADGE = 'text_badge'
}

type Columns = {
    id: string
    name: string
    key: string
    image?: string
    type: eTypeColumns
}

const ActionColumn = ({ row, onEdit }: { row: any, onEdit: any }) => {
    const dispatch = useAppDispatch()
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()


    const onDelete = () => {
        dispatch(toggleDeleteConfirmation(true))
        dispatch(setSelectedProduct(row.id))
        console.log('ELIMINANDO...');
    }

    const edit = () => {
        onEdit(row);
    }

    return (
        <div className="flex justify-end text-lg">
            <span
                className={`cursor-pointer p-2 hover:${textTheme}`}
                onClick={edit}
            >
                <HiOutlinePencil />
            </span>
            <span
                className="cursor-pointer p-2 hover:text-red-500"
                onClick={onDelete}
            >
                <HiOutlineTrash />
            </span>
        </div>
    )
}

const Column = ({ row }: { row: { img?: string, name: string } }) => {
    const avatar = row.img ? (
        <Avatar src={row.img} />
    ) : (
        <Avatar icon={<FiPackage />} />
    )

    return (
        <div className="flex items-center">
            {avatar}
            <span className={`ml-2 rtl:mr-2 font-semibold`}>{row.name}</span>
        </div>
    )
}

interface ItemsTableProps<T> {
    deleteMessage: string;
    dataList: T[];
    columnsList: Columns[];
    onEdit: any;
}

const ItemsTable = <T,>({ deleteMessage, dataList, columnsList, onEdit }: ItemsTableProps<T>) => {
    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.salesProductList.data.tableData
    )

    const filterData = useAppSelector(
        (state) => state.salesProductList.data.filterData
    )

    const loading = useAppSelector(
        (state) => state.salesProductList.data.loading
    )

    const data = dataList;

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, sort])

    useEffect(() => {
        if (tableRef) {
            tableRef.current?.resetSorting()
        }
    }, [filterData])

    const tableData = useMemo(
        () => ({ pageIndex, pageSize, sort, query, total }),
        [pageIndex, pageSize, sort, query, total]
    )

    const fetchData = () => {
        dispatch(getProducts({ pageIndex, pageSize, sort, query, filterData }))
    }

    const columns: ColumnDef<any>[] = useMemo(
        () => {
            let finalColumns: any[] = columnsList.map((col) => {
                let column = {
                    header: col.name,
                    accessorKey: col.name,
                    cell: (props: any) => {
                        const row = props.row.original;

                        switch (col.type) {
                            case eTypeColumns.TEXT_IMAGE:
                                return <Column row={{ img: row.image, name: row[col.key] }} />
                            case eTypeColumns.TEXT_BADGE:
                                
                                return (
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            className={row[col.key] ? "bg-emerald-500 ": 'bg-red-500'}
                                        />
                                        <span
                                            className={`capitalize font-semibold ${row[col.key] ? 'text-emerald-500' : 'text-red-500'}`}
                                        >
                                            {row[col.key] ? 'Activo' : 'Inactivo'}
                                        </span>
                                        
                                    </div>
                                ) 
                                
                            case eTypeColumns.BADGE:
                                
                                return (<div className="flex items-center gap-2">
                                    <Badge
                                        type='big'
                                        className={"bg-" + row[col.key] + '-500'}
                                    />
                                </div>)
                            case eTypeColumns.IMAGE:
                                return row[col.key] ? (
                                        <Avatar src={row[col.key]} />
                                    ) : (
                                        <Avatar icon={<FiPackage />} />
                                    )
                                

                            default:
                                return (
                                    <div className="flex items-center gap-2">
                                        {row[col.key]}
                                    </div>
                                )
                        }
                    },
                };

                return column;
            })

            finalColumns.push({
                header: '',
                id: 'action',
                cell: (props: any) => <ActionColumn row={props.row.original} onEdit={onEdit} />,
            },)

            return finalColumns;
        }, []
    )



    const onPaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        dispatch(setTableData(newTableData))
    }

    const onSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        dispatch(setTableData(newTableData))
    }

    const onSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        dispatch(setTableData(newTableData))
    }

    return (
        <>
            <DataTable
                ref={tableRef}
                columns={columns}
                data={data}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                loading={loading}
                pagingData={{
                    total: tableData.total as number,
                    pageIndex: tableData.pageIndex as number,
                    pageSize: tableData.pageSize as number,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                onSort={onSort}
            />
            <DeleteConfirmation deleteMessage={deleteMessage} />
        </>
    )
}

export default ItemsTable
