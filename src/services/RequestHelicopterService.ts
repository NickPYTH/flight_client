import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../configs/url.config";
import {RequestsGridType} from "../screens/RequestsByHelicopter/Requests.types";

export const requestHelicopterAPI = createApi({
    reducerPath: 'requestHelicopter',
    baseQuery: fetchBaseQuery({
        baseUrl: `${secure}://${host}:${port}/flight/api/requestHelicopter`,
    }),
    tagTypes: ['RequestHelicopter'],
    endpoints: (build) => ({
        getAllByYear: build.mutation<RequestsGridType[], number>({
            query: (year) => ({
                url: `/getAllByYear?year=${year}`,
                method: 'GET',
            }),
            invalidatesTags: ['RequestHelicopter']
        }),
        getById: build.mutation<any, string>({
            query: (year) => ({
                url: `/get?id=${year}`,
                method: 'GET',
            }),
            invalidatesTags: ['RequestHelicopter']
        }),
    })
});
