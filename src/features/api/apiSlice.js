import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  //Slice to target
  reducerPath: 'apiSlice',
  //Base Query get url.
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://6383958b6e6c83b7a9974a62.mockapi.io/data',
  }),
  //Get all
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => '/data',
      providesTags: ['Post'],
    }),
    //Add new 
    addNewPost: builder.mutation({
      query: (payload) => ({
        url: '/data',
        method: 'POST',
        body: payload,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
      invalidatesTags: ['Post'],
    }),
    //Update
    updatePost: builder.mutation({
      query: (payload) => {
        console.log(payload)
        const { id, ...body } = payload
        return {
          url: `/data/${id}`,
          method: 'PUT',
          body,
        }
      },
      invalidatesTags: ['Post'],
    }),
    //Delete
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/data/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'],
    }),
  }),
})
export const {
  useGetPostsQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = apiSlice