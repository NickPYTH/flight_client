import {combineReducers, configureStore} from "@reduxjs/toolkit";
import userReducer from './reducers/UserSlice'
import {requestsByFilialsAPI} from "../services/RequestsByFilialsService";
import {filialsAPI} from "../services/FilialsService";
import {workTypesAPI} from "../services/WorkTypesService";
import {airportsAPI} from "../services/AirportsService";
import {employeeResponsibleAPI} from "../services/EmployeeResponsibleService";
import {flightFilialAPI} from "../services/FlightFilialService";

const rootReducer = combineReducers({
    userReducer,
    [requestsByFilialsAPI.reducerPath]: requestsByFilialsAPI.reducer,
    [filialsAPI.reducerPath]: filialsAPI.reducer,
    [workTypesAPI.reducerPath]: workTypesAPI.reducer,
    [airportsAPI.reducerPath]: airportsAPI.reducer,
    [employeeResponsibleAPI.reducerPath]: employeeResponsibleAPI.reducer,
    [flightFilialAPI.reducerPath]: flightFilialAPI.reducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(requestsByFilialsAPI.middleware)
                .concat(filialsAPI.middleware)
                .concat(workTypesAPI.middleware)
                .concat(airportsAPI.middleware)
                .concat(employeeResponsibleAPI.middleware)
                .concat(flightFilialAPI.middleware)
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
