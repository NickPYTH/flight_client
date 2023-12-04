import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../configs/url.config";
import {FlightTargetModel} from "../models/FlightTargetModel";

export const flightTargetAPI = createApi({
    reducerPath: 'flightTargetAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${secure}://${host}:${port}/flight/api/flightTarget`,
    }),
    tagTypes: ['flightTarget'],
    endpoints: (build) => ({
        getAll: build.mutation<FlightTargetModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['flightTarget']
        }),
    })
});
