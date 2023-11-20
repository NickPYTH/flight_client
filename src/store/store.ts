import {combineReducers, configureStore} from "@reduxjs/toolkit";
import userReducer from './reducers/UserSlice'
import {requestsByFilialsAPI} from "../services/RequestsByFilialsService";
import {filialsAPI} from "../services/FilialsService";
import {workTypesAPI} from "../services/WorkTypeService";

const rootReducer = combineReducers({
    userReducer,
    [requestsByFilialsAPI.reducerPath]: requestsByFilialsAPI.reducer,
    [filialsAPI.reducerPath]: filialsAPI.reducer,
    [workTypesAPI.reducerPath]: workTypesAPI.reducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(requestsByFilialsAPI.middleware)
                .concat(filialsAPI.middleware)
                .concat(workTypesAPI.middleware)
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
