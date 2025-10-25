"use client"

import {
    PromptInput,
    PromptInputActions,
    PromptInputTextarea,
} from "@/shared/components/ui/prompt-input"
import { PromptSuggestion } from "@/shared/components/ui/prompt-suggestion"
import { Button } from "@/shared/components/ui/button"
import { ArrowUpIcon } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { setInputValue } from "../chatSlice"


interface ChatInputProps {
    onSubmit: (message: string) => void;
    disabled?: boolean;
}

function ChatInput({ onSubmit, disabled = false }: ChatInputProps) {
    const { promptSuggestion } = useSelector((state: any) => state.chat);
    const dispatch = useDispatch()
    const { inputValue } = useSelector((state: any) => state.chat)

    const handleSend = () => {
        console.log("hellllllll")
        const message = inputValue.trim();
        if (message) {
            onSubmit(message);
        }
    };

    return (
        <div className="flex w-full flex-col space-y-4">
            {promptSuggestion?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {promptSuggestion.map((suggestion: string, index: number) => (
                        <PromptSuggestion
                            key={index}
                            onClick={() => {
                                dispatch(setInputValue(suggestion));
                                // Optionally auto-submit when suggestion is clicked
                                // onSubmit(suggestion);
                            }}
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
                onSubmit={handleSend}
            >
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