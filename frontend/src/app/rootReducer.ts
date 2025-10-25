import chatReducer from "../features/chat/chatSlice";
import pdfReducer from "../features/pdf/pdfSlice";
import dashboardReducer from "../features/dashboard/uiSlice";

const rootReducer = {
    chat: chatReducer,
    pdf: pdfReducer,
    ui: dashboardReducer
}

export default rootReducer;