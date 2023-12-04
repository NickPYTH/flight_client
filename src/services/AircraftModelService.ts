import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../configs/url.config";
import {AircraftModel} from "../models/AircraftModel";

export const aircraftModelAPI = createApi({
    reducerPath: 'aircraftModelAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${secure}://${host}:${port}/flight/api/aircraftModel`,
    }),
    tagTypes: ['aircraftModel'],
    endpoints: (build) => ({
        getAll: build.mutation<AircraftModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['aircraftModel']
        }),
    })
});
