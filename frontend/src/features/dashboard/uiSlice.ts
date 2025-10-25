import { createSlice } from "@reduxjs/toolkit";


const uiInitialState = {
    sidebarOpen: true,
    viewMode: 'split',
    theme: 'light'
};

const uiSlice = createSlice({
    name: 'ui',
    initialState: uiInitialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setViewMode: (state, action) => {
            state.viewMode = action.payload;
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        }
    }
});

export const { toggleSidebar, setViewMode, setTheme } = uiSlice.actions;
export default uiSlice.reducer;