import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {db} from '@/configs/firebase.config';
import { collection, getDoc, doc, setDoc, addDoc, getDocs, query, where, Timestamp, deleteDoc } from 'firebase/firestore/lite';
import dayjs from 'dayjs';

export type Income = {
    id: string
    amount: number
    category_id: string
    category_name: string
    date: Timestamp | null
    description: string
    is_active?: boolean
    is_archived?: boolean
}

export type IncomesList = Income[]

type Query = {
    sort: 'asc' | 'desc' | ''
    search: ''
}

type PutIncomeRequest = {
    description: string
    amount: number
    category_id: string
    category_name: string
    date: Timestamp | null
    is_archived?: boolean
    id?: string
}

export type IncomesState = {
    loading: boolean
    incomesList: Income[]
    icomeListByDate: Income[]
    view: 'grid' | 'list'
    query: Query
    newProjectDialog: boolean
}

export const SLICE_NAME = 'income'

const userId = "UmibcB1i3xQiZA4yyESuDT5eeRp1";

export const getIncomesList = createAsyncThunk(
    SLICE_NAME + '/getIncomesList',
    async () => {
        try {
            
            const collect = query(collection(db, `users/${userId}/incomes`), where("is_archived", "==", false));
            
            const snapShot = await getDocs(collect);
            let finalData: any = [];
            snapShot.forEach((doc) => {
                const data = doc.data();
                data.date = dayjs(new Date(data.date.seconds * 1000)).toISOString();
                finalData.push({...data, id: doc.id});
            })
            
            return finalData
        } catch (error) {
            console.error("🚀 ~ error:", error)
            return null;
        }
    }
)

export const getIncomesListByDate = createAsyncThunk(
    SLICE_NAME + '/getIncomesListByDate',
    async (data: {startdate: string, endDate: string}) => {
        try {
            
            const collect = query(collection(db, `users/${userId}/incomes`), where("is_archived", "==", false), where("date", '>=', new Date(data.startdate)), where("date", '<=', new Date(data.endDate)));
            
            const snapShot = await getDocs(collect);
            let finalData: any = [];
            snapShot.forEach((doc) => {
                const data = doc.data();
                data.date = dayjs(new Date(data.date.seconds * 1000)).toISOString();
                finalData.push({...data, id: doc.id});
            })
            
            return finalData
        } catch (error) {
            console.error("🚀 ~ error:", error)
            return null;
        }
    }
)

export const putIncome = createAsyncThunk(
    SLICE_NAME + '/putIncomes',
    async (data: PutIncomeRequest) => {
        try {
            let document;
            let document_id = data.id;
            if(data.id){
                document = doc(db, `users/${userId}/incomes/${data.id}`)
                await setDoc(document, data);
            }else{
                document = collection(db, `users/${userId}/incomes`);
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
            console.error("🚀 ~ error:", error)
            return null
        }
    }
)

export const deleteIncome = createAsyncThunk(
    SLICE_NAME + '/deleteIncome',
    async (id: string) => {
        try {
            let document;
            
            document = doc(db, `users/${userId}/incomes/${id}`)
            await deleteDoc(document)

            return id
        } catch (error) {
            console.error("🚀 ~ error:", error)
            return null
        }
    }
)

const initialState: IncomesState = {
    loading: false,
    incomesList: [],
    icomeListByDate: [],
    view: 'grid',
    query: {
        sort: 'asc',
        search: '',
    },
    newProjectDialog: false,
}

const incomeSlice = createSlice({
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
            .addCase(getIncomesList.pending, (state) => {
                state.loading = true
            })
            .addCase(getIncomesList.fulfilled, (state, action) => { 
                state.incomesList = action.payload
                state.loading = false
            })
            .addCase(getIncomesListByDate.pending, (state) => {
                state.loading = true
            })
            .addCase(getIncomesListByDate.fulfilled, (state, action) => { 
                console.log("🚀 ~ .addCase ~ action.payload:", action.payload)
                state.icomeListByDate = action.payload
                state.loading = false
            })
            .addCase(putIncome.pending, (state) =>{
                state.loading = true
            })
            .addCase(putIncome.fulfilled, (state, action) => {
                if(action.payload){
                    const expenseFound = state.incomesList.findIndex((incomes) => incomes.id === action.payload!.id);
                    
                    if(expenseFound != -1){
                        state.incomesList[expenseFound] = action.payload;
                    }else{
                        state.incomesList = [...state.incomesList, ...[action.payload]]
                    }
                }

            })
    },
})

export const { toggleView, toggleSort, toggleNewProjectDialog, setSearch } =
incomeSlice.actions

export default incomeSlice.reducer
