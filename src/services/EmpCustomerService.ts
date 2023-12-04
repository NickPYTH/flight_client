import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../configs/url.config";
import {AircraftModel} from "../models/AircraftModel";
import {EmpCustomerModel} from "../models/EmpCustomerModel";

export const empCustomerAPI = createApi({
    reducerPath: 'empCustomerAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${secure}://${host}:${port}/flight/api/empCustomer`,
    }),
    tagTypes: ['empCustomer'],
    endpoints: (build) => ({
        getAll: build.mutation<EmpCustomerModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['empCustomer']
        }),
    })
});
