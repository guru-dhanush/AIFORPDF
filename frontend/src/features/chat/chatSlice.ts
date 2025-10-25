import { createSlice } from "@reduxjs/toolkit";

export type ChatType = {
    role: string,
    text: string,
    citations?: number[],
    timestamp: string

}

export type InitialStateType = {
    messages: ChatType[],
    loading: boolean,
    error: string | null,
    inputValue: string,
    promptSuggestion: string[]
}

const chatInitialState: InitialStateType = {
    messages: [],
    loading: false,
    error: null,
    inputValue: '',
    promptSuggestion: []
};

const chatSlice = createSlice({
    name: 'chat',
    initialState: chatInitialState,
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setInputValue: (state, action) => {
            state.inputValue = action.payload;
        },
        resetChat: () => chatInitialState,
        setPromptSuggestion: (state, action) => {
            state.promptSuggestion = action.payload;
        }

    }
})
export const { addMessage, setLoading, setError, setInputValue, resetChat, setPromptSuggestion } = chatSlice.actions;
export default chatSlice.reducer;