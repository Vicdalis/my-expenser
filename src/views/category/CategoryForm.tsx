import { useState, useEffect } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import hooks from '@/components/ui/hooks'
import { Field, Form, Formik, FieldProps } from 'formik'
import { HiCheck, HiCheckCircle } from 'react-icons/hi'
import { components, MultiValueGenericProps, OptionProps } from 'react-select'
import {
    getMembers,
    putProject,
    toggleNewProjectDialog,
    useAppDispatch,
    useAppSelector,
} from './store'
import cloneDeep from 'lodash/cloneDeep'
import * as Yup from 'yup'
import Segment from '@/components/ui/Segment'
import classNames from 'classnames'

type FormModel = {
    name: string
    type: string
    color: string
}

type TaskCount = {
    completedTask?: number
    totalTask?: number
}

const { MultiValueLabel } = components

const { useUniqueId } = hooks

const CustomSelectOption = ({
    innerProps,
    label,
    data,
    isSelected,
}: OptionProps<{ img: string }>) => {
    return (
        <div
            className={`flex items-center justify-between p-2 ${
                isSelected
                    ? 'bg-gray-100 dark:bg-gray-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
            {...innerProps}
        >
            <div className="flex items-center">
                <Avatar shape="circle" size={20} src={data.img} />
                <span className="ml-2 rtl:mr-2">{label}</span>
            </div>
            {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
        </div>
    )
}

const CustomControlMulti = ({ children, ...props }: MultiValueGenericProps) => {
    const { img } = props.data

    return (
        <MultiValueLabel {...props}>
            <div className="inline-flex items-center">
                <Avatar
                    className="mr-2 rtl:ml-2"
                    shape="circle"
                    size={15}
                    src={img}
                />
                {children}
            </div>
        </MultiValueLabel>
    )
}

const validationSchema = Yup.object().shape({
    title: Yup.string().min(3, 'Too Short!').required('Title required'),
    content: Yup.string().required('Title required'),
    assignees: Yup.array().min(1, 'Assignee required'),
    rememberMe: Yup.bool(),
})

const CategoryForm = () => {
    const dispatch = useAppDispatch()

    const newId = useUniqueId('project-')

    const [taskCount, setTaskCount] = useState<TaskCount>({})

    useEffect(() => {
        dispatch(getMembers())
    }, [dispatch])

    const onSubmit = (
        formValue: FormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)

        const { name, type, color } = formValue

        const { totalTask, completedTask } = taskCount

        const values = {
            id: newId,
            name: name,
            type: type,
            color: color,
            totalTask,
            completedTask,
            progression:
                ((completedTask as number) / (totalTask as number)) * 100 || 0,
        }
        dispatch(putProject(values))
        dispatch(toggleNewProjectDialog(false))
    }

    const segmentSelections = [
        { value: 'Ingresos', disabled: false },
        { value: 'Gastos', disabled: false },
    ]

    const colourOptions = [
        {label: 'Blanco', value: '#fff'}
    ]

    return (
        <Formik
            initialValues={{
                name: '',
                type: "",
                color: ''
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
                                name="title"
                                placeholder="Nombre de Categoría..."
                                component={Input}
                            />
                        </FormItem>

                        <FormItem label='Tipo' invalid={
                                (errors.type && touched.type) as ''
                            }
                            errorMessage={errors.type as string}
                        >
                            <Segment defaultValue={['Team']} className="gap-2 md:flex-row flex-col">
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
                        </FormItem>

                        <FormItem
                            label="Color"
                            invalid={
                                (errors.color && touched.color) as ''
                            }
                            errorMessage={errors.color as string}
                        >
                            <Select
                                placeholder="Please Select"
                                options={colourOptions}
                            ></Select>
                        </FormItem>
                        
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
