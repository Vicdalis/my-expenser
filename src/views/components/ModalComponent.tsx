import Dialog from '@/components/ui/Dialog'
import { ReactNode } from 'react';

interface modalType {
    openModal: boolean
    onClose: any
    title: string,
    children?: ReactNode;
}

const ModalComponent = ({openModal, onClose, title, children}:modalType) => {
    return (
        <Dialog
            isOpen={openModal}
            onClose={onClose}
            onRequestClose={onClose}
        >
            <h4>{title}</h4>
            <div className="mt-4">
                {children}
            </div>
        </Dialog>
    )
}

export default ModalComponent
