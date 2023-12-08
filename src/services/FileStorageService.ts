import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../configs/url.config";
import {WorkTypeModel} from "../models/WorkTypeModel";

export const fileStorageAPI = createApi({
    reducerPath: 'fileStorageAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${secure}://${host}:${port}/flight/api/file`,
    }),
    tagTypes: ['fileStorage'],
    endpoints: (build) => ({
        getAll: build.mutation<any, string>({
            query: (id) => ({
                url: `/getFilesByRequest?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['fileStorage']
        }),
    })
});
