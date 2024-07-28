import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {db} from '@/configs/firebase.config';
import { collection, getDoc, doc, setDoc, addDoc, getDocs, query, where } from 'firebase/firestore/lite';

type Colors = {
    label: string,
    value: string
}

export type Category = {
    id: string
    name: string
    color: string
    type: string
    is_active?: boolean
    is_archived?: boolean
}

export type CategoryList = Category[]

type Query = {
    sort: 'asc' | 'desc' | ''
    search: ''
}

type GetCategoryRequest = Query

type PutCategoryRequest = {
    name: string
    type: string
    color: string
    is_active: boolean
    is_archived?: boolean
    id?: string
}

export type ProjectListState = {
    loading: boolean
    categoryList: Category[]
    view: 'grid' | 'list'
    query: Query
    newProjectDialog: boolean
}

export const SLICE_NAME = 'category'

const userId = "UmibcB1i3xQiZA4yyESuDT5eeRp1";

export const getList = createAsyncThunk(
    SLICE_NAME + '/getList',
    async () => {
        
        const collect = query(collection(db, `users/${userId}/categories`), where("is_archived", "==", false));
        
        const snapShot = await getDocs(collect);
        let finalData: any = [];
        snapShot.forEach((doc) => {
            finalData.push({...doc.data(), id: doc.id});
        })
        
        console.log("🚀 ~ snapShot.forEach ~ finalData:", finalData)
        return finalData
    }
)

export const getColors = createAsyncThunk(
    SLICE_NAME + '/getColors',
    async () => {
        const colorsDoc = await getDoc (doc(db, 'global_settings', 'colors'));
        let colors: Colors[] = [];

        if(colorsDoc.exists()){
            colors = colorsDoc.data().items as Colors[];
        }else{
             console.log('El documento consultado no existe');
        }

        return colors
    }
)

export const putCategory = createAsyncThunk(
    SLICE_NAME + '/putCategory',
    async (data: PutCategoryRequest) => {
        console.log("🚀 ~ data:", data)
        const document = data.id ? doc(db, `users/${userId}/categories/${data.id}`) : doc(db, `users/${userId}/categories`);
        await setDoc(document, data);
        const savedData = {...data, id: document.id}
        console.log("🚀 ~ savedData:", savedData)
        return savedData
    }
)

const initialState: ProjectListState = {
    loading: false,
    categoryList: [],
    view: 'grid',
    query: {
        sort: 'asc',
        search: '',
    },
    newProjectDialog: false,
}

const projectListSlice = createSlice({
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
                state.categoryList = action.payload
                state.loading = false
            })
            .addCase(putCategory.pending, (state) =>{
                state.loading = true
            })
            .addCase(putCategory.fulfilled, (state, action) => {
                const categoryFound = state.categoryList.findIndex((category) => category.id === action.payload.id);
                console.log("🚀 ~ .addCase ~ categoryFound:", categoryFound)
                if(categoryFound != -1){
                    state.categoryList[categoryFound] = action.payload;
                }else{
                    state.categoryList = [...state.categoryList, ...[action.payload]]
                }

            })
    },
})

export const { toggleView, toggleSort, toggleNewProjectDialog, setSearch } =
projectListSlice.actions

export default projectListSlice.reducer
