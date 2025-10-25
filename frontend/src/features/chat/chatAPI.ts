import { api } from '../../app/api';

// Chat API endpoints
export const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Send chat message
    sendMessage: builder.mutation({
      query: ({ documentId, message, chatHistory }) => ({
        url: '/chat',
        method: 'POST',
        body: {
          documentId,
          message,
          chatHistory: chatHistory || [],
        },
      }),
      // Don't cache chat responses
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useSendMessageMutation } = chatApi;
