import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../configs/url.config";
import {WorkTypeModel} from "../models/WorkTypeModel";

export const workTypesAPI = createApi({
    reducerPath: 'workTypesAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${secure}://${host}:${port}/flight/api/worktype`,
    }),
    tagTypes: ['workTypes'],
    endpoints: (build) => ({
        getAll: build.mutation<WorkTypeModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['workTypes']
        }),
        get: build.mutation<WorkTypeModel, number>({
            query: (id) => ({
                url: `/get?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['workTypes']
        }),
    })
});
