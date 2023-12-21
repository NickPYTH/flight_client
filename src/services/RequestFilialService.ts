import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../configs/url.config";
import {
    CreateRequestFilialType,
    RequestData,
    RequestRoutesGridType,
    RequestsByFilialsGridType
} from "../screens/RequestsByFilials/RequestsFilials.types";

export const requestsByFilialsAPI = createApi({
    reducerPath: 'requestsByFilials',
    baseQuery: fetchBaseQuery({
        baseUrl: `${secure}://${host}:${port}/flight/api/requestFilial`,
    }),
    tagTypes: ['RequestsByFilials'],
    endpoints: (build) => ({
        getAllByYear: build.mutation<RequestsByFilialsGridType[], number>({
            query: (year) => ({
                url: `/getAllByYear?year=${year}`,
                method: 'GET',
            }),
            invalidatesTags: ['RequestsByFilials']
        }),
        getById: build.mutation<RequestData, string>({
            query: (id) => ({
                url: `/get?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['RequestsByFilials']
        }),
        sendOnConfirm: build.mutation<string, string>({
            query: (id) => ({
                url: `/sendOnConfirm?flightRequestId=${id}`,
                method: 'POST',
            }),
            invalidatesTags: ['RequestsByFilials']
        }),
        confirm: build.mutation<string, string>({
            query: (id) => ({
                url: `/confirm?flightRequestId=${id}`,
                method: 'POST',
            }),
            invalidatesTags: ['RequestsByFilials']
        }),
        decline: build.mutation<string, string>({
            query: (id) => ({
                url: `/decline?flightRequestId=${id}`,
                method: 'POST',
            }),
            invalidatesTags: ['RequestsByFilials']
        }),
        create: build.mutation<{id: string}, CreateRequestFilialType>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['RequestsByFilials']
        }),
    })
});
