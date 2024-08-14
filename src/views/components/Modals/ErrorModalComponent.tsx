import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'

export type ModalContent = {
    title?: string,
    content?: string,
    onAccept?: any,
    openModal: boolean,
    onCloseModal: any
}

const ErrorModalComponent = (props: ModalContent) => {
    const [dialogIsOpen, setIsOpen] = useState(false)

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = (e: MouseEvent) => {
        setIsOpen(false)
        props.onCloseModal();
    }

    const onDialogOk = (e: MouseEvent) => {
        setIsOpen(false)
        if(props.onAccept){
            props.onAccept();
        }
    }

    useEffect(() => {
        if(props.openModal === true){
            openDialog();
        }
    }, [])

    return (
        <div>
            <Dialog
                isOpen={dialogIsOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <h5 className="mb-4">{props.title ?? 'Ha ocurrido un error'}</h5>
                <p>
                    {props.content ?? 'No se han podido recuperar los datos'}
                </p>
                <div className="text-right mt-6">
                    {/* <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={onDialogClose}
                    >
                        Cancelar
                    </Button> */}
                    <Button variant="solid" onClick={onDialogOk}>
                        Aceptar
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default ErrorModalComponent