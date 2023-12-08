import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../configs/url.config";
import {FlightPlanModel} from "../models/FlightPlanModel";


export const flightPlanAPI = createApi({
    reducerPath: 'flightPlanAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${secure}://${host}:${port}/flight/api/flightPlan`,
    }),
    tagTypes: ['flightPlan'],
    endpoints: (build) => ({
        update: build.mutation<FlightPlanModel, FlightPlanModel>({
            query: (body) => ({
                url: `/update`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['flightPlan']
        }),
        create: build.mutation<FlightPlanModel, FlightPlanModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['flightPlan']
        }),
        delete: build.mutation<number, number>({
            query: (id) => ({
                url: `/delete?id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['flightPlan']
        }),
    })
});
