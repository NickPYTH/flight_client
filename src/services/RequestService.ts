import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../configs/url.config";
import {
    CostGridType,
    CostRequest,
    RequestData,
    RequestHistoryGridType,
    RequestsGridType,
    UpdateRequest
} from "../screens/Requests/Requests.types";

export const requestAPI = createApi({
    reducerPath: 'request',
    baseQuery: fetchBaseQuery({
        baseUrl: `${secure}://${host}:${port}/flight/api/request`,
    }),
    tagTypes: ['Request'],
    endpoints: (build) => ({
        getAllByYear: build.mutation<RequestsGridType[], number>({
            query: (year) => ({
                url: `/getAllByYear?year=${year}`,
                method: 'GET',
            }),
            invalidatesTags: ['Request']
        }),
        getById: build.mutation<RequestData, string>({
            query: (id) => ({
                url: `/get?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['Request']
        }),
        updateDate: build.mutation<UpdateRequest, any>({
            query: (body) => ({
                url: `/update`,
                method: 'PUT',
                body
            }),
            invalidatesTags: ['Request']
        }),
        getHistory: build.mutation<RequestHistoryGridType[], string>({
            query: (id) => ({
                url: `/getHistory?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['Request']
        }),
        createCost: build.mutation<string, CostRequest>({
            query: (body) => ({
                url: `/createCost`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Request']
        }),
        updateCost: build.mutation<string, CostRequest>({
            query: (body) => ({
                url: `/updateCost`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Request']
        }),
        getCosts: build.mutation<CostGridType[], string>({
            query: (id) => ({
                url: `/getCosts?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['Request']
        }),
        create: build.mutation<any, any>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Request']
        }),
    })
});
