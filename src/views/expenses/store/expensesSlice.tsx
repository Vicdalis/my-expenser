import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {db} from '@/configs/firebase.config';
import { collection, getDoc, doc, setDoc, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore/lite';

export type Expense = {
    id: string
    amount: number
    category_id: string
    category_name: string
    date: Timestamp
    description: string
    is_active?: boolean
    is_archived?: boolean
}

export type ExpensesList = Expense[]

type Query = {
    sort: 'asc' | 'desc' | ''
    search: ''
}

type PutExpenseRequest = {
    description: string
    amount: number
    category_id: string
    category_name: string
    date: Timestamp
    is_archived?: boolean
    id?: string
}

export type ExpensesState = {
    loading: boolean
    expenseList: Expense[]
    view: 'grid' | 'list'
    query: Query
    newProjectDialog: boolean
}

export const SLICE_NAME = 'expense'

const userId = "UmibcB1i3xQiZA4yyESuDT5eeRp1";

export const getList = createAsyncThunk(
    SLICE_NAME + '/getList',
    async () => {
        
        const collect = query(collection(db, `users/${userId}/expenses`), where("is_archived", "==", false));
        
        const snapShot = await getDocs(collect);
        let finalData: any = [];
        snapShot.forEach((doc) => {
            finalData.push({...doc.data(), id: doc.id});
        })
        
        console.log("🚀 ~ snapShot.forEach ~ finalData:", finalData)
        return finalData
    }
)

export const putExpense = createAsyncThunk(
    SLICE_NAME + '/putExpense',
    async (data: PutExpenseRequest) => {
        console.log("🚀 ~ data:", data)
        const document = data.id ? doc(db, `users/${userId}/expenses/${data.id}`) : doc(db, `users/${userId}/expenses`);
        await setDoc(document, data);
        const savedData = {...data, id: document.id}
        console.log("🚀 ~ savedData:", savedData)
        return savedData
    }
)

const initialState: ExpensesState = {
    loading: false,
    expenseList: [],
    view: 'grid',
    query: {
        sort: 'asc',
        search: '',
    },
    newProjectDialog: false,
}

const expensesSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        toggleView: (state, action) => {
            state.view = action.payload
        },
        toggleSort: (state, action) => {
            state.query.sort = action.payload
        },
        setSearch: (state, action) => {
            state.query.search = action.payload
        },
        toggleNewProjectDialog: (state, action) => {
            state.newProjectDialog = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getList.pending, (state) => {
                state.loading = true
            })
            .addCase(getList.fulfilled, (state, action) => { 
                state.expenseList = action.payload
                state.loading = false
            })
            .addCase(putExpense.pending, (state) =>{
                state.loading = true
            })
            .addCase(putExpense.fulfilled, (state, action) => {
                const expenseFound = state.expenseList.findIndex((expense) => expense.id === action.payload.id);
                console.log("🚀 ~ .addCase ~ expenseFound:", expenseFound)
                if(expenseFound != -1){
                    state.expenseList[expenseFound] = action.payload;
                }else{
                    state.expenseList = [...state.expenseList, ...[action.payload]]
                }

            })
    },
})

export const { toggleView, toggleSort, toggleNewProjectDialog, setSearch } =
expensesSlice.actions

export default expensesSlice.reducer
