import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, resetChat, setError, setInputValue, setLoading } from "../chatSlice";
import { resetPdf, setCurrentPage } from "../../pdf/pdfSlice";
import { useSendMessageMutation } from "../chatAPI";
import MessageItem from "./MessageItem";
import type { ChatType } from "../chatSlice";
import ChatInput from "./ChatInput";
import playpower_labs_logo from "../../../assets/playpower_labs_logo.jpeg"
import { Loader } from "@/shared/components/ai-elements/loader";
import { X } from "lucide-react";

const ChatInterface = () => {
    const { messages, loading, inputValue } = useSelector((state: any) => state.chat);
    const { documentId, numPages } = useSelector((state: any) => state.pdf);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const [sendMessage] = useSendMessageMutation();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {

        console.log(!inputValue.trim(), loading, !documentId)
        if (!inputValue.trim() || loading || !documentId) return;

        const userMessage = {
            role: 'user',
            text: inputValue,
            timestamp: new Date().toISOString()
        };

        dispatch(addMessage(userMessage));
        dispatch(setInputValue(''));
        dispatch(setLoading(true));

        try {
            // Build chat history
            const chatHistory = messages.map((msg: ChatType) => ({
                role: msg.role,
                text: msg.text
            }));

            // Send message to backend
            const response = await sendMessage({
                documentId,
                message: inputValue,
                chatHistory
            }).unwrap();

            const assistantMessage = {
                role: 'assistant',
                text: response.message,
                citations: response.citations,
                timestamp: new Date().toISOString()
            };
            dispatch(addMessage(assistantMessage));
        } catch (error) {
            dispatch(setError('Failed to get response. Please try again.'));
            console.log(error)
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleCitationClick = (page: number) => {
        if (page <= numPages) {
            dispatch(setCurrentPage(page));
        }
    };

    return (
        <div className="h-[calc(100%-20px)] bg-white m-2 rounded-2xl">
            <div className="flex flex-col rounded-2xl border-2 border-gray-50 h-full " style={{
                backgroundImage: `
        radial-gradient(circle at center, #f0ffff 0%, transparent 70%)
      `,
                mixBlendMode: "multiply",
            }}>

                {/* Header Area */}
                <div className="px-4 py-3">
                    <div className="flex items-center justify-end">
                        <button className="text-gray-600 hover:text-gray-800 bg-gray-50 rounded-lg p-2 cursor-pointer" onClick={() => { dispatch(resetChat()); dispatch(resetPdf()) }}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-center">
                            <div className="flex flex-col items-center">
                                <img src={playpower_labs_logo} alt="Playpower Labs Logo" className="w-24 h-24 mb-4 rounded-lg" />
                                <p className="text-gray-600 font-medium">Start a conversation</p>
                                <p className="text-gray-500 text-sm mt-1">Ask questions about your PDF document</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((message: ChatType, idx: number) => (
                                <MessageItem
                                    key={idx}
                                    message={message}
                                    onCitationClick={handleCitationClick}
                                />
                            ))}
                            {loading && (
                                <div className="flex justify-start mb-4">
                                    <div className="bg-gray-100 rounded-lg px-4 py-3">
                                        <Loader />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>
                <div className="m-5">  <ChatInput onSubmit={handleSend} disabled={loading} /></div>
            </div>
        </div>

    );
};


export default ChatInterface