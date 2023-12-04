import {BrowserRouter, Route, Routes} from 'react-router-dom'
import React from "react";
import {EditRequestByFilialsScreen} from "../screens/RequestsByFilials/EditRequestByFilialsScreen";
import {CreateRequestByFilialsScreen} from "../screens/RequestsByFilials/CreateRequestByFilialsScreen";
import {AllRequestsScreen} from "../screens/Requests/AllRequestsScreen";
import {AllRequestsByFilialsScreen} from "../screens/RequestsByFilials/AllRequestsByFilialsScreen";
import {EditRequestScreen} from "../screens/Requests/EditRequestScreen";

export const Router: React.FC = () => {

    return (<BrowserRouter>
        <Routes>
            {/* RequestsByFilials */}
            <Route
                path='/requestsFilials'
                element={<AllRequestsByFilialsScreen/>}
            />
            <Route
                path='/requestsFilials/:id'
                element={<EditRequestByFilialsScreen/>}
            />
            <Route
                path='/requestsFilials/create'
                element={<CreateRequestByFilialsScreen/>}
            />
            {/* ----- */}

            {/* Requests */}
            <Route
                path='/requests'
                element={<AllRequestsScreen/>}
            />
            <Route
                path='/requests/:id'
                element={<EditRequestScreen/>}
            />
            <Route
                path='/requests/create'
                element={<CreateRequestByFilialsScreen/>}
            />
            {/* ----- */}
            <Route
                path='*'
                element={<div>404</div>}
            />
        </Routes>
    </BrowserRouter>)
};