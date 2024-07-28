import { useState, useEffect } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import hooks from '@/components/ui/hooks'
import { Field, FieldProps, Form, Formik } from 'formik'
import { HiCheckCircle } from 'react-icons/hi'
import { components } from 'react-select'
import {
    getColors,
    putCategory,
    toggleNewProjectDialog,
    useAppDispatch,
    Category,
} from './store'
import * as Yup from 'yup'
import Segment from '@/components/ui/Segment'
import classNames from 'classnames'
import Switcher from '@/components/ui/Switcher'

type FormModel = {
    name: string
    type: string
    color: string
    id?: string
    is_active: boolean
}

interface iColor {
    label: string;
    value: string;
}

const { MultiValueLabel } = components

const { useUniqueId } = hooks

const validationSchema = Yup.object().shape({
    name: Yup.string().min(3, 'Too Short!').required('Ingrese un nombre'),
    type: Yup.string().required('Seleccione un tipo'),
    color: Yup.string().min(1, 'El color es requerido'),
    is_active: Yup.bool(),
    // rememberMe: Yup.bool(),
})

const CategoryForm = ({ closeModal, dataForm }: { closeModal: any, dataForm?: Category }) => {
    const dispatch = useAppDispatch()


    const [colourOptions, setColors] = useState<iColor[]>([])

    useEffect(() => {
        dispatch(getColors()).then((result: any) => {
            setColors(result.payload);
        })
    }, [dispatch])

    const onSubmit = (
        formValue: FormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        console.log('GUARDANDO ');
        setSubmitting(true)
        const { name, type, color, is_active } = formValue

        const values = {
            name: name,
            type: type,
            color: color,
            icon: "",
            is_active: is_active,
            is_archived: false,
            ...(dataForm && { id: dataForm.id })
        }
        console.log("🚀 ~ CategoryForm ~ values:", values)
        dispatch(putCategory(values))
        dispatch(toggleNewProjectDialog(false))
        closeModal();
    }

    const segmentSelections = [
        { value: 'Ingresos', disabled: false },
        { value: 'Gastos', disabled: false },
    ]

    return (
        <Formik
            initialValues={{
                name: dataForm?.name ?? '',
                type: dataForm?.type ?? "Gastos",
                color: dataForm?.color ?? '',
                is_active: dataForm?.is_active == undefined ? true : dataForm.is_active,
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                
                onSubmit(values, setSubmitting)
            }}
        >
            {({ touched, errors, values }) => (
                <Form>
                    <FormContainer>
                        <FormItem
                            label="Nombre"
                            invalid={errors.name && touched.name}
                            errorMessage={errors.name}
                        >
                            <Field
                                type="text"
                                autoComplete="off"
                                name="name"
                                placeholder="Nombre de Categoría..."
                                component={Input}
                            />
                        </FormItem>

                        <FormItem label='Tipo'

                            invalid={
                                (errors.type && touched.type) as ''
                            }
                            errorMessage={errors.type as string}

                        >
                            
                            <Field name="type">
                                {({ field, form }: FieldProps<FormModel>) => (
                                    
                                    <Segment defaultValue={[field.value.toString()]}
                                        className="gap-2 md:flex-row flex-col"
                                        onChange={(val) => {
                                            form.setFieldValue(
                                                field.name,
                                                val[0]
                                            ); 
                                        }}
                                    >
                                        {segmentSelections.map((item) => (
                                            <Segment.Item
                                                key={item.value}
                                                value={item.value}
                                                disabled={item.disabled}
                                            >
                                                {({ active, value, onSegmentItemClick, disabled }) => {
                                                    return (
                                                        <div
                                                            className={classNames(
                                                                'flex',
                                                                'ring-1',
                                                                'justify-between',
                                                                'border',
                                                                'rounded-md ',
                                                                'border-gray-300',
                                                                'py-5 px-4',
                                                                'cursor-pointer',
                                                                'select-none',
                                                                'w-100',
                                                                'md:w-[260px]',
                                                                active
                                                                    ? 'ring-cyan-500 border-cyan-500'
                                                                    : 'ring-transparent',
                                                                disabled
                                                                    ? 'opacity-50 cursor-not-allowed'
                                                                    : 'hover:ring-cyan-500 hover:border-cyan-500'
                                                            )}
                                                            onClick={onSegmentItemClick}
                                                        >
                                                            <div>
                                                                <h6>{value}</h6>
                                                            </div>
                                                            {active && (
                                                                <HiCheckCircle className="text-cyan-500 text-xl" />
                                                            )}
                                                        </div>
                                                    )
                                                }}
                                            </Segment.Item>
                                        ))}
                                    </Segment>
                                )}
                            </Field>
                        </FormItem>

                        <FormItem
                            label="Color"
                            invalid={
                                (errors.color && touched.color) as ''
                            }
                            errorMessage={errors.color as string}
                        >
                            <Field name="color">
                                {({ field, form }: FieldProps<FormModel>) => (
                                    <Select
                                        placeholder="Color..."
                                        field={field}
                                        options={colourOptions}
                                        name='color'
                                        value={colourOptions.find(
                                            (option) =>
                                                option.value ===
                                                values.color
                                        )}
                                        onChange={(val: any) => form.setFieldValue(
                                            field.name,
                                            val.value
                                        )}
                                    ></Select>
                                )}
                            </Field>
                        </FormItem>
                                {
                                    dataForm &&
                                        <FormItem label='Activo' invalid={(errors.is_active && touched.is_active) as ''}>
                                            <div>
                                                <div className="mb-4">
                                                <Field name="is_active">
                                                    {({ field, form }: FieldProps<FormModel>) => (
                                                        <Switcher name='is_active' defaultChecked={field.value as unknown as boolean} color="green-500" 
                                                            onChange={(val) => {
                                                                
                                                                console.log("🚀 ~ CategoryForm ~ val:", val)
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    val
                                                                )
                                                            }}
                                                        />
                                                        )}
                                                    </Field>

                                                </div>
                                            </div>
                                        </FormItem>
                                }

                        <Button block variant="solid" type="submit">
                            Guardar
                        </Button>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
}

export default CategoryForm
