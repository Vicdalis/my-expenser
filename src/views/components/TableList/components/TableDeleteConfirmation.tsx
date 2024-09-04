import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    toggleDeleteConfirmation,
    // deleteProduct,
    // getProducts,
    useAppDispatch,
    useAppSelector,
} from '../store'

const TableDeleteConfirmation = ({deleteMessage, onDeleteAction}: {deleteMessage: string, onDeleteAction: any}) => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.salesProductList.data.deleteConfirmation
    )
    const selectedProduct = useAppSelector(
        (state) => state.salesProductList.data.selectedProduct
    )
    // const tableData = useAppSelector(
    //     (state) => state.salesProductList.data.tableData
    // )

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        // const success = await deleteProduct({ id: selectedProduct })

        // if (success) {
        //     dispatch(getProducts(tableData))
        //     toast.push(
        //         <Notification
        //             title={'Successfuly Deleted'}
        //             type="success"
        //             duration={2500}
        //         >
        //             Eliminado exitosamente! 
        //         </Notification>,
        //         {
        //             placement: 'top-center',
        //         }
        //     )
        // }

        onDeleteAction(selectedProduct);
    }

    return (
        <ConfirmDialog
            isOpen={dialogOpen}
            type="danger"
            title="Eliminando"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>
                {/* Are you sure you want to delete this product? All record related
                to this product will be deleted as well. This action cannot be
                undone. */}
                {deleteMessage}
            </p>
        </ConfirmDialog>
    )
}

export default TableDeleteConfirmation
