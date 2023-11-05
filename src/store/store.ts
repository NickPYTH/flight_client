import {combineReducers, configureStore} from "@reduxjs/toolkit";
import userReducer from './reducers/UserSlice'
import {requestsByFilialsAPI} from "../services/RequestsByFilialsService";
import {filialsAPI} from "../services/FilialsService";

const rootReducer = combineReducers({
    userReducer,
    [requestsByFilialsAPI.reducerPath]: requestsByFilialsAPI.reducer,
    [filialsAPI.reducerPath]: filialsAPI.reducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(requestsByFilialsAPI.middleware)
                .concat(filialsAPI.middleware)
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
