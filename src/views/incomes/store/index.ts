import { combineReducers } from '@reduxjs/toolkit'
import reducers, { SLICE_NAME, IncomesState } from './incomesSlice';
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const incomeReducer = combineReducers({
    data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: IncomesState
        }
    }
> = useSelector

export * from './incomesSlice'
export { useAppDispatch } from '@/store'
export default incomeReducer
