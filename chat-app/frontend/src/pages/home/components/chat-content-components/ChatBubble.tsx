import { IChatMessageModel } from "@/redux/slices/chatSlice"
import { RefObject } from "react"
import DefaultUserAvatar from "@/assets/Default_pfp.jpg"
import { convertDateToHM } from "@/utils/dateConverter"

type ChatBubbleProps = {
    message: IChatMessageModel,
    isOwnedChat: boolean,
    isNewest: boolean,
    isSendingMessage: boolean
    senderName: string,
    senderImage?: string,
    newestMessageRef?: RefObject<HTMLDivElement | null> | null
    topMessageRef?: RefObject<HTMLDivElement | null> | null
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isOwnedChat, isNewest, isSendingMessage, senderName, senderImage, newestMessageRef, topMessageRef }) => {
    const chatRef = newestMessageRef !== null ? newestMessageRef : topMessageRef;
    console.log("is newest message: ", isNewest, newestMessageRef)
    return <div className={`chat ${isOwnedChat ? "chat-end" : "chat-start"}`} ref={chatRef} >
        <div className="chat-image avatar">
            <div className="w-10 rounded-full">
                <img
                    alt="Tailwind CSS chat bubble component"
                    src={senderImage || DefaultUserAvatar} />
            </div>
        </div>
        <div className="chat-header">
            {senderName}
            {message.createdAt && <time className="text-xs opacity-50">{convertDateToHM(message.createdAt)}</time>}
        </div>
        <div className="chat-bubble">
            <div className="flex flex-col gap-2 py-1">
                {message?.image && <img src={message.image} alt="chat_image" className='rounded-md max-w-full max-h-full object-cover object-center' />}
                {message?.text && <p>{message.text}</p>}
            </div>
        </div>
        {
            (isNewest && isOwnedChat) && <div className="chat-footer opacity-50">{isSendingMessage ? "Sending" : "Delivered"}</div>
        }
    </div>
}

