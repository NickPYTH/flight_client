import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../configs/url.config";
import {WorkTypeModel} from "../models/WorkTypeModel";
import {AirportModel} from "../models/AirportModel";
import {FlightFilialModel} from "../models/FlightFilialModel";


export const flightFilialAPI = createApi({
    reducerPath: 'flightFilialAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${secure}://${host}:${port}/flight/api/flightFilial`,
    }),
    tagTypes: ['flightFilial'],
    endpoints: (build) => ({
        update: build.mutation<FlightFilialModel, FlightFilialModel>({
            query: (body) => ({
                url: `/update`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['flightFilial']
        }),
        create: build.mutation<FlightFilialModel, FlightFilialModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['flightFilial']
        }),
    })
});
