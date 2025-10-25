import { createSlice } from "@reduxjs/toolkit";

interface uiStateProps {
    sidebarOpen: boolean;
    viewMode: 'pdfview' | 'chatview';
    theme: string;
}
const uiInitialState: uiStateProps = {
    sidebarOpen: true,
    viewMode: 'chatview',
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