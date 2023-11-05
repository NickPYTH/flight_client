import {BrowserRouter, Route, Routes} from 'react-router-dom'
import React from "react";
import {AllRequestsByFilialsScreen} from "../screens/RequestsByFilials/AllRequestsByFilialsScreen";
import {EditRequestByFilialScreen} from "../screens/RequestsByFilials/EditRequestByFilialScreen";

export const Router: React.FC = () => {

    return (<BrowserRouter>
        <Routes>
            <Route
                path='/requests'
                element={<AllRequestsByFilialsScreen/>}
            />
            <Route
                path='/requests/:id'
                element={<EditRequestByFilialScreen />}
            />
            <Route
                path='*'
                element={<div>404</div>}
            />
        </Routes>
    </BrowserRouter>)
};