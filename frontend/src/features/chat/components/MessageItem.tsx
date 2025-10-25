import type { ChatType } from "../chatSlice";
import CitationButton from "./CitationButton";


const MessageItem = ({ message, onCitationClick }: { message: ChatType, onCitationClick: (page: number) => void }) => (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[80%] rounded-lg px-4 py-3 ${message.role === 'user'
            ? ' bg-[#223050] text-white'
            : 'bg-gray-100 text-gray-900'
            }`}>
            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            {message.citations && message.citations.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-300">
                    <span className="text-xs font-medium text-gray-600 mr-2">Citations:</span>
                    {message.citations.map((page, idx) => (
                        <CitationButton key={idx} page={page} onClick={onCitationClick} />
                    ))}
                </div>
            )}
        </div>
    </div>
);

export default MessageItem;


