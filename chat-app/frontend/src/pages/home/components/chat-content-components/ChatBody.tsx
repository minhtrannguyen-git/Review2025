import { RefObject, useEffect, useRef, useState } from "react";
import { ChatBubble } from "./ChatBubble";
import { IChatMessageModel } from "@/redux/slices/chatSlice";
import { Loader2 } from "lucide-react";

type ChatBodyProps = {
    messages: IChatMessageModel[],
    selectedUserId: string,
    selectedUserName?: string,
    userImage?: string,
    selectedUserImage?: string,
    topMessageRef: RefObject<HTMLDivElement | null>,
    isLoadingMoreMessageVisible: boolean,
    loadingChat: boolean,
    topMessageId?: string | null,
    shoudlScrollIntoView: boolean,
    hasMore: boolean
}

export const ChatBody: React.FC<ChatBodyProps> = ({ messages, selectedUserId, selectedUserName, userImage, selectedUserImage, topMessageRef, isLoadingMoreMessageVisible, topMessageId, loadingChat, shoudlScrollIntoView, hasMore }) => {

    const chatBoxRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
    const [currentLastMessageId, setCurrentLastMessageId] = useState<string | null>("");

    useEffect(() => {
        if (messages && messages.length > 0) {
            if (shoudlScrollIntoView) {
                chatBoxRef.current?.scrollIntoView({ behavior: "smooth" });
                setCurrentLastMessageId(messages[messages.length - 1]?._id || null);
            } else {
                if (currentLastMessageId !== messages[messages.length - 1]?._id) {
                    chatBoxRef.current?.scrollIntoView({ behavior: "smooth" });
                }
            }

        }
    }, [messages])

    return <div className="flex-1 overflow-scroll bg-base-100 p-4" >{
        (messages && messages?.length > 0) ? (<>
            {!hasMore && !isLoadingMoreMessageVisible && <div className="flex justify-center items-center py-2 gap-4 italic text-secondary text-sm">There is no more messages</div>}
            {isLoadingMoreMessageVisible && <div className="flex justify-center items-center py-2 gap-4"><Loader2 className={`${loadingChat ? "animate-spin" : "animate-none"} `} size={20} /> Loading more messages...</div>}
            {messages.map((message, index) => {
                const isOwnedChat = message.senderId !== selectedUserId;
                const isNewest = index === messages.length - 1;
                const isTopMessage = message._id == topMessageId;
                console.log("Message _id", message._id, "Top Message Id", topMessageId, "Is Top Message", isTopMessage)
                return <ChatBubble
                    key={message._id}
                    message={message}
                    isOwnedChat={isOwnedChat}
                    isNewest={isNewest}
                    isSendingMessage={false}
                    senderName={isOwnedChat ? "You" : selectedUserName || "Other"}
                    senderImage={isOwnedChat ? userImage : selectedUserImage}
                    newestMessageRef={isNewest ? chatBoxRef : null}
                    topMessageRef={isTopMessage ? topMessageRef : null} />
            })}

        </>) : (<div className="flex justify-center items-center h-full text-gray-500 italic font-bold">
            No messages to show. Start a conversation!
        </div>)

    }</div>
}