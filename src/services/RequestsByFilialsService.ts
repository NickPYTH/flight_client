import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../configs/url.config";
import {
    RequestData,
    RequestRoutesGridType,
    RequestsByFilialsGridType
} from "../screens/RequestsByFilials/RequestsByFilials.types";

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
    })
});
