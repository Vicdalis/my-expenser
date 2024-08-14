import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {db} from '@/configs/firebase.config';
import { collection, getDoc, doc, setDoc, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore/lite';

export type Expense = {
    id: string
    amount: number
    category_id: string
    category_name: string
    date: Timestamp | null
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
    date: Timestamp | null
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

export const getExpenseList = createAsyncThunk(
    SLICE_NAME + '/getExpenseList',
    async () => {
        try {
            
            const collect = query(collection(db, `users/${userId}/expenses`), where("is_archived", "==", false));
            
            const snapShot = await getDocs(collect);
            let finalData: any = [];
            snapShot.forEach((doc) => {
                const data = doc.data();
                finalData.push({...doc.data(), id: doc.id});
            })
            
            return finalData
        } catch (error) {
            console.log("🚀 ~ error:", error)
            return null;
        }
    }
)

export const putExpense = createAsyncThunk(
    SLICE_NAME + '/putExpense',
    async (data: PutExpenseRequest) => {
        try {
            let document;
            if(data.id){
                document = doc(db, `users/${userId}/expenses/${data.id}`)
                await setDoc(document, data);
            }else{
                document = collection(db, `users/${userId}/expenses`);
                await addDoc(document, data);
            }
            
            let updatedData: any = structuredClone(data);
            updatedData.date = data.date?.toString() 

            const savedData = {...data, id: document.id}
            return savedData
        } catch (error) {
            console.log("🚀 ~ error:", error)
            return null
        }
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
            .addCase(getExpenseList.pending, (state) => {
                state.loading = true
            })
            .addCase(getExpenseList.fulfilled, (state, action) => { 
                console.log("🚀 ~ .addCase ~ action.payload:", action.payload)
                state.expenseList = action.payload
                state.loading = false
            })
            .addCase(putExpense.pending, (state) =>{
                state.loading = true
            })
            .addCase(putExpense.fulfilled, (state, action) => {
                if(action.payload){
                    const expenseFound = state.expenseList.findIndex((expense) => expense.id === action.payload!.id);
                    console.log("🚀 ~ .addCase ~ expenseFound:", expenseFound)
                    if(expenseFound != -1){
                        state.expenseList[expenseFound] = action.payload;
                    }else{
                        state.expenseList = [...state.expenseList, ...[action.payload]]
                    }
                }

            })
    },
})

export const { toggleView, toggleSort, toggleNewProjectDialog, setSearch } =
expensesSlice.actions

export default expensesSlice.reducer
