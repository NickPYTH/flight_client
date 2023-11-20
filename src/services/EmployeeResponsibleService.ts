import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../configs/url.config";
import {EmployeeResponsibleModel} from "../models/EmployeeResponsibleModel";

export const employeeResponsibleAPI = createApi({
    reducerPath: 'employeeResponsibleAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${secure}://${host}:${port}/flight/api/employeeResponsible`,
    }),
    tagTypes: ['employeeResponsible'],
    endpoints: (build) => ({
        getAll: build.mutation<EmployeeResponsibleModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['employeeResponsible']
        }),
        get: build.mutation<EmployeeResponsibleModel, number>({
            query: (id) => ({
                url: `/get?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['employeeResponsible']
        }),
    })
});
