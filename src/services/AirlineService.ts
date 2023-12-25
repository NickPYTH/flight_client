import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../configs/url.config";
import {AirlineModel} from "../models/AirlineModel";

export const airlinesAPI = createApi({
    reducerPath: 'airlinesAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${secure}://${host}:${port}/flight/api/airline`,
    }),
    tagTypes: ['airlines'],
    endpoints: (build) => ({
        getAll: build.mutation<AirlineModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['airlines']
        }),
    })
});
