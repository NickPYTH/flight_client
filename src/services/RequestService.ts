import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../configs/url.config";
import {RequestData, RequestHistoryGridType, RequestsGridType, UpdateRequest} from "../screens/Requests/Requests.types";

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
    })
});
