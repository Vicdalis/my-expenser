import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {db} from '@/configs/firebase.config';
import { collection, getDoc, doc, setDoc, addDoc, getDocs, query, where, Timestamp, deleteDoc } from 'firebase/firestore/lite';
import dayjs from 'dayjs';

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
    expenseByDate: Expense[]
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
                data.date = dayjs(new Date(data.date.seconds * 1000)).toISOString();
                finalData.push({...data, id: doc.id});
            })
            
            return finalData
        } catch (error) {
            console.log("🚀 ~ error:", error)
            return null;
        }
    }
)

export const getExpenseByDate = createAsyncThunk(
    SLICE_NAME + '/getExpenseByDate',
    async (data: {startdate: string, endDate: string}) => {
        try {
            console.log("🚀 ~ startdate:", data.startdate)
            console.log("🚀 ~ endDate:", data.endDate)
            
            const collect = query(collection(db, `users/${userId}/expenses`), where("is_archived", "==", false), where("date", '>=', new Date(data.startdate)), where("date", '<=', new Date(data.endDate)));
            
            const snapShot = await getDocs(collect);
            let finalData: any = [];
            snapShot.forEach((doc) => {
                const data = doc.data();
                data.date = dayjs(new Date(data.date.seconds * 1000)).toISOString();
                finalData.push({...data, id: doc.id});
            })
            console.log("🚀 ~ snapShot.forEach ~ finalData:", finalData)
            
            return finalData
        } catch (error) {
            console.error("🚀 ~ error:", error)
            return rejectWithValue(error);
        }
    }
)

export const putExpense = createAsyncThunk(
    SLICE_NAME + '/putExpense',
    async (data: PutExpenseRequest) => {
        try {
            let document;
            let document_id = data.id;

            if(data.id){
                document = doc(db, `users/${userId}/expenses/${data.id}`)
                await setDoc(document, data);
            }else{
                document = collection(db, `users/${userId}/expenses`);
                await addDoc(document, data).then((data) => {
                    document_id = data.id
                });
            }
            
            let updatedData: any = structuredClone(data);
            let mydate: any = data.date;
            updatedData.date = dayjs(new Date(mydate ?? 0 * 1000)).toISOString()

            const savedData = {...updatedData, id: document_id}
            return savedData
        } catch (error) {
            console.log("🚀 ~ error:", error)
            return null
        }
    }
)

export const deleteExpense = createAsyncThunk(
    SLICE_NAME + '/deleteExpense',
    async (id: string) => {
        try {
            let document;
            
            document = doc(db, `users/${userId}/expenses/${id}`)
            await deleteDoc(document)
            
            return id
        } catch (error) {
            console.log("🚀 ~ error:", error)
            return null
        }
    }
)

const initialState: ExpensesState = {
    loading: false,
    expenseList: [],
    expenseByDate: [],
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
                state.expenseList = action.payload
                state.loading = false
            })
            .addCase(getExpenseByDate.pending, (state) => {
                state.loading = true
            })
            .addCase(getExpenseByDate.fulfilled, (state, action) => { 
                console.log("🚀 ~ .addCase ~ action.payload:", action.payload)
                state.expenseByDate = action.payload
            })
            .addCase(putExpense.pending, (state) =>{
                state.loading = true
            })
            .addCase(putExpense.fulfilled, (state, action) => {
                if(action.payload){
                    const expenseFound = state.expenseList.findIndex((expense) => expense.id === action.payload!.id);
                    
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
function rejectWithValue(error: unknown): any {
    throw new Error('Function not implemented.');
}

