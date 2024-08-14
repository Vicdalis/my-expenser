import { useState, useEffect } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import hooks from '@/components/ui/hooks'
import { Field, FieldProps, Form, Formik } from 'formik'
import { HiCheck } from 'react-icons/hi'
import { components } from 'react-select'
import * as Yup from 'yup'
import Switcher from '@/components/ui/Switcher'
import { Expense, putExpense, useAppDispatch } from './store'
import { Timestamp } from 'firebase/firestore/lite'
import DatePicker from '@/components/ui/DatePicker'
import { Category, eCategoryTypes, getCategoryListByType } from '../category/store'
import Badge from '@/components/ui/Badge'

import type {
    ControlProps,
} from 'react-select';

const { Control } = components

type Option = {
    value: string
    label: string
    color: string
}

type FormModel = {
    description: string
    category: string
    category_name: string
    amount: number
    date: Timestamp | null
    id?: string
    is_active: boolean
}


const { useUniqueId } = hooks

const validationSchema = Yup.object().shape({
    description: Yup.string().min(3, 'Demasiado Corto!').required('Ingrese un nombre para el gasto'),
    category: Yup.string().required('Seleccione una categoría'),
    amount: Yup.number().min(1, 'El monto es requerido'),
    date: Yup.date().required('Debe escoger una fecha'),
    is_active: Yup.bool(),
})

const CustomSelectCategoryOption = ({ innerProps, label, data, isSelected }: { innerProps: any, label: string, data: any, isSelected: boolean }) => {
    return (
        <div
            className={`flex items-center justify-between p-2 cursor-pointer ${
                isSelected
                    ? 'bg-gray-100 dark:bg-gray-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
            {...innerProps}
        >
            <div className="flex items-center">
                <Badge
                                        type='big'
                                        className={"bg-" + data.color + '-500'}
                                    />
                <span className="ml-2 rtl:mr-2">{label}</span>
            </div>
            {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
        </div>
    )
}

const CustomCategoryControl = ({ children, ...props }: ControlProps<Option>) => {
    const selected = props.getValue()[0]
    return (
        <Control {...props} className='cursor-pointer'>
            {selected && (
                <Badge
                type='big'
                className={"ml-2 bg-" + selected.color + '-500'}
            />
            )}
            {children}
        </Control>
    )
}

const ExpenseForm = ({ closeModal, dataForm }: { closeModal: any, dataForm?: Expense }) => {
    const dispatch = useAppDispatch()

    const [categoryOptions, setCategories] = useState<Option[]>([])

    useEffect(() => {
        dispatch(getCategoryListByType(eCategoryTypes.GASTOS)).then((result: any) => {
            
            const categories = result.payload.map((category: Category) => {return {
                value: category.id,
                label: category.name,
                color: category.color
            }})
            
            setCategories(categories);
        })
    }, [dispatch])

    const onSubmit = (
        formValue: FormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        console.log('GUARDANDO ');
        setSubmitting(true)
        const { description, category, category_name, date, amount, is_active } = formValue

        const values = {
            description: description,
            category_id: category,
            category_name: category_name,
            date: date,
            amount: amount,
            is_active: is_active,
            is_archived: false,
            ...(dataForm && { id: dataForm.id })
        }
        
        dispatch(putExpense(values)).then((saved) => {
            console.log("🚀 ~ dispatch ~ saved:", saved)
            
        })
        closeModal();
    }

    return (
        <Formik
            initialValues={{
                description: dataForm?.description ?? '',
                category: dataForm?.category_id ?? "",
                amount: dataForm?.amount ?? 0,
                date: dataForm?.date ?? null,
                is_active: dataForm?.is_active == undefined ? true : dataForm.is_active,
                category_name: dataForm?.category_name ?? ""
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                console.log("🚀 ~ ExpenseForm ~ values:", values)
                
                onSubmit(values, setSubmitting)
            }}
        >
            {({ touched, errors, values }) => (
                <Form>
                    <FormContainer>
                        <FormItem
                            label="Nombre"
                            invalid={errors.description && touched.description}
                            errorMessage={errors.description}
                        >
                            <Field
                                type="text"
                                autoComplete="off"
                                name="description"
                                placeholder="Descripción de Gasto..."
                                component={Input}
                            />
                        </FormItem>

                        <FormItem
                            label="Monto"
                            invalid={errors.amount && touched.amount}
                            errorMessage={errors.amount}
                        >
                            <Field
                                type="number"
                                autoComplete="off"
                                name="amount"
                                prefix="$"
                                component={Input}
                            />
                        </FormItem>
                        <FormItem
                            label="Fecha"
                            invalid={errors.date && touched.date}
                            errorMessage={errors.date}
                        >
                            <Field name="date">
                            {({ field, form }: FieldProps) => (
                                <DatePicker field={field}
                                    form={form}
                                    value={field.value} name="date" 
                                    placeholder="Seleccione una fecha" 
                                    onChange={(date) => {
                                        form.setFieldValue(field.name, date)
                                    }}
                                />
                            )}
                            </Field>
                        </FormItem>

                        <FormItem
                            label="Categoría"
                            invalid={
                                (errors.category && touched.category) as ''
                            }
                            errorMessage={errors.category as string}
                        >
                            <Field name="category">
                                {({ field, form }: FieldProps<FormModel>) => (
                                    <Select
                                        placeholder="Categoría..."
                                        field={field}
                                        options={categoryOptions}
                                        
                                        components={{
                                            Option: CustomSelectCategoryOption,
                                            Control: CustomCategoryControl,
                                        }}
                                        value={categoryOptions.find(
                                            (option) =>
                                                option.value ===
                                                values.category
                                        )}
                                        onChange={(val: any) => {form.setFieldValue(
                                            field.name,
                                            val.value
                                        ); form.setFieldValue(
                                            'category_name',
                                            val.label
                                        ); console.log(val)}}
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

export default ExpenseForm
