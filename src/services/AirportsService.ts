import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../configs/url.config";
import {WorkTypeModel} from "../models/WorkTypeModel";
import {AirportModel} from "../models/AirportModel";

export const airportsAPI = createApi({
    reducerPath: 'airportsAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${secure}://${host}:${port}/flight/api/airport`,
    }),
    tagTypes: ['airports'],
    endpoints: (build) => ({
        getAll: build.mutation<AirportModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['airports']
        }),
        get: build.mutation<AirportModel, number>({
            query: (id) => ({
                url: `/get?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['airports']
        }),
    })
});
