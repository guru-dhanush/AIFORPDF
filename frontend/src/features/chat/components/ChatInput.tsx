"use client"

import {
    PromptInput,
    PromptInputActions,
    PromptInputTextarea,
} from "@/shared/components/ui/prompt-input"
import { PromptSuggestion } from "@/shared/components/ui/prompt-suggestion"
import { Button } from "@/shared/components/ui/button"
import { ArrowUpIcon, Paperclip, X } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { resetChat, setInputValue } from "../chatSlice"
import { setViewMode } from "@/features/dashboard/uiSlice"
import { resetPdf } from "@/features/pdf/pdfSlice"


interface ChatInputProps {
    onSubmit: (message: string) => void;
    disabled?: boolean;
}

function ChatInput({ onSubmit, disabled = false }: ChatInputProps) {
    const { promptSuggestion } = useSelector((state: any) => state.chat);
    const dispatch = useDispatch()
    const { inputValue, messages } = useSelector((state: any) => state.chat)
    const { fileName } = useSelector((state: any) => state.pdf)

    const handleSend = () => {
        const message = inputValue.trim();
        if (message) {
            onSubmit(message);
        }
    };

    return (
        <div className="flex w-full flex-col space-y-4">
            {promptSuggestion?.length > 0 && inputValue.trim() === "" && messages.length === 0 && (
                <div className="flex flex-wrap gap-2">
                    {promptSuggestion.map((suggestion: string, index: number) => (
                        <PromptSuggestion
                            key={index}
                            onClick={() => dispatch(setInputValue(suggestion))}
                            className="max-w-[250px] wrap-break-word"
                        >
                            {suggestion}
                        </PromptSuggestion>
                    ))}
                </div>

            )}

            <PromptInput
                className="border-input bg-background border shadow-xs"
                value={inputValue}
                onValueChange={(value) => dispatch(setInputValue(value))}
            >
                <div className="flex flex-wrap gap-2 pb-2">


                    <div
                        className="bg-secondary flex items-center gap-2 rounded-2xl px-3 py-2 text-sm"
                        onClick={() => dispatch(setViewMode('pdfview'))}
                    >
                        <Paperclip className="size-4" />
                        <span className="max-w-[120px] truncate">{fileName}</span>
                        <button
                            className="hover:bg-secondary/50 rounded-full p-1"
                            onClick={() => {
                                dispatch(resetPdf())
                                dispatch(resetChat())
                            }}
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                </div>


                <PromptInputTextarea
                    placeholder="Ask a question about the document..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />
                <PromptInputActions className="justify-end">
                    <Button
                        size="sm"
                        className="size-9 cursor-pointer rounded-full"
                        onClick={handleSend}
                        disabled={!inputValue.trim() || disabled}
                        aria-label="Send"
                    >
                        <ArrowUpIcon className="h-4 min-h-4 min-w-4 w-4" />
                    </Button>
                </PromptInputActions>
            </PromptInput>
        </div >
    );
}

export default ChatInput