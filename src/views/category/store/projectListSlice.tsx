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

type PutCategoryRequest = {
    name: string
    type: string
    color: string
    is_active: boolean
    is_archived?: boolean
    id?: string
}

export enum eCategoryTypes {
    GASTOS = "Gastos",
    INGRESOS = "Ingresos"
}

export type ProjectListState = {
    loading: boolean
    categoryList: Category[]
    view: 'grid' | 'list'
    query: Query
    newProjectDialog: boolean
}

export const SLICE_NAME = 'categories'

const userId = "UmibcB1i3xQiZA4yyESuDT5eeRp1";

export const getCategoryListByType = createAsyncThunk(
    SLICE_NAME + '/getList',
    async (type: eCategoryTypes) => {
        
        const collect = query(collection(db, `users/${userId}/categories`), where("is_archived", "==", false), where("is_active", "==", true), where("type", "==", type));
        
        const snapShot = await getDocs(collect);
        let finalData: any = [];
        snapShot.forEach((doc) => {
            finalData.push({...doc.data(), id: doc.id});
        })
        
        console.log("🚀 ~ snapShot.forEach ~ finalData:", finalData)
        return finalData
    }
)

export const getCategoryList = createAsyncThunk(
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
        try {
            let document;
            let document_id = data.id;

            if(data.id){
                document = doc(db, `users/${userId}/categories/${data.id}`)
                await setDoc(document, data);
            }else{
                document = collection(db, `users/${userId}/categories`);
                await addDoc(document, data).then((newData) => {
                    document_id = newData.id
                });
            }
            
            const savedData = {...data, id: document_id!.toString()}
            return savedData
        } catch (error) {
            console.log("🚀 ~ error:", error)
            return null
        }
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
            .addCase(getCategoryList.pending, (state) => {
                state.loading = true
            })
            .addCase(getCategoryList.fulfilled, (state, action) => { 
                state.categoryList = action.payload
                state.loading = false
            })
            .addCase(putCategory.pending, (state) =>{
                state.loading = true
            })
            .addCase(putCategory.fulfilled, (state, action) => {
                if(action.payload){
                    const categoryFound = state.categoryList.findIndex((category) => category.id === action.payload!.id);
                    console.log("🚀 ~ .addCase ~ categoryFound:", categoryFound)
                    if(categoryFound != -1){
                        state.categoryList[categoryFound] = action.payload;
                    }else{
                        state.categoryList = [...state.categoryList, ...[action.payload]]
                    }
                }

            })
    },
})

export const { toggleView, toggleSort, toggleNewProjectDialog, setSearch } =
projectListSlice.actions

export default projectListSlice.reducer
