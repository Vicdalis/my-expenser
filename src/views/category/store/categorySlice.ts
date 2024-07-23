import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetScrumBoardtMembers,
} from '@/services/CategoryService'
import {db} from '@/configs/firebase.config';
import { collection, getDoc, doc, addDoc, getDocs, query, where } from 'firebase/firestore/lite';

type Member = {
    id: string
    name: string
    email: string
    img: string
}

type Colors = {
    label: string,
    value: string
}

type Category = {
    id: string
    name: string
    icon: string
    color: string
    type: string
    status?: boolean
}

export type CategoryList = Category[]

type Query = {
    sort: 'asc' | 'desc' | ''
    search: ''
}

type GetCategoryRequest = Query

type GetScrumBoardtMembersResponse = {
    allMembers: Member[]
}

type PutCategoryRequest = {
    name: string
    type: string
    color: string
    icon: string
    status: boolean
}

type PutCategoryResponse = CategoryList

export type CategoryState = {
    loading: boolean
    categoryList: Category[]
    view: 'grid' | 'list'
    query: Query
    newProjectDialog: boolean
}

export const SLICE_NAME = 'category'

export const getList = createAsyncThunk(
    SLICE_NAME + '/getList',
    async () => {
        const call = query(collection(db, 'categories'), where("status", "==", true))
        const snapShot = await getDocs(call);
        let finalData: any = [];
        snapShot.forEach((doc) => {
            finalData.push({...doc.data(), id: doc.id});
        })

        return finalData
    }
)

export const getMembers = createAsyncThunk(
    SLICE_NAME + '/getMembers',
    async () => {
        const response =
            await apiGetScrumBoardtMembers<GetScrumBoardtMembersResponse>()
        const data = response.data.allMembers.map((item: any) => ({
            value: item.id,
            label: item.name,
            img: item.img,
        }))
        console.log("🚀 ~ data:", data)
        return data
    }
)

export const getColors = createAsyncThunk(
    SLICE_NAME + '/getColors',
    async () => {
        const colorsDoc = await getDoc (doc(db, 'global_settings', 'colors'));
        let colors: Colors[] = [];

        if(colorsDoc.exists()){
            console.log("🚀 ~ colorsDoc.data():", colorsDoc.data())
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
        const response = await addDoc(collection(db, "categories"), data);
        const savedData = {...data, id: response.id}
        return savedData
    }
)

const initialState: CategoryState = {
    loading: false,
    categoryList: [],
    view: 'grid',
    query: {
        sort: 'asc',
        search: '',
    },
    newProjectDialog: false,
}

const categorySlice = createSlice({
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
            .addCase(getList.fulfilled, (state, action) => { 
                state.categoryList = action.payload
                state.loading = false
            })
            .addCase(getList.pending, (state) => {
                state.loading = true
            })
            .addCase(putCategory.fulfilled, (state, action) => {
                state.categoryList = [...state.categoryList, ...[action.payload]]
            })
    },
})

export const { toggleView, toggleSort, toggleNewProjectDialog, setSearch } =
categorySlice.actions

export default categorySlice.reducer
