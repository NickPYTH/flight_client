import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../configs/url.config";
import {FilialModel} from "../models/FilialModel";

export const filialsAPI = createApi({
    reducerPath: 'filialsAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${secure}://${host}:${port}/flight/api/filial`,
    }),
    tagTypes: ['filials'],
    endpoints: (build) => ({
        getAll: build.mutation<FilialModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['filials']
        }),
        get: build.mutation<FilialModel, number>({
            query: (id) => ({
                url: `/get?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['filials']
        }),
    })
});
