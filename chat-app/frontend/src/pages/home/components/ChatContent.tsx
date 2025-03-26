import DefaultUserAvatar from '@/assets/Default_pfp.jpg';
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getSelectedUserMessages, IChatMessageModel, selectNewUser, sendMessage } from "@/redux/slices/chatSlice";
import { IUser } from "@/types/user.type";
import { convertDateToHM } from "@/utils/dateConverter";
import { Loader, Loader2, MessageCircleMore, Send, Upload, X } from "lucide-react";
import { ChangeEvent, FormEvent, RefObject, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import imageCompression from 'browser-image-compression';


export const ChatContent = () => {
  const { selectedUserId, selectedUserMessages, allUsers, onlineUsers, loadingChat, isSendingMessage } = useAppSelector(state => state.chat);
  const { user } = useAppSelector(state => state.auth)

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (selectedUserId) {
      dispatch(getSelectedUserMessages(selectedUserId))
    }
  }, [selectedUserId])

  const [selectedUserInformation, isOnline] = useMemo(() => {
    return [allUsers.find(u => u._id === selectedUserId), onlineUsers.includes(selectedUserId)]
  }, [selectedUserId, allUsers, onlineUsers])

  const handleDeselectUser = () => {
    dispatch(selectNewUser(""));
  }
  return (
    <div className="flex flex-col w-full">
      {selectedUserId ? (
        loadingChat ? (<>
          <div className="flex-1 w-full flex justify-center items-center">
            <div className="flex flex-col items-center gap-3">
              <Loader className="size-10 text-primary animate-spin" />
              <div className="text-sm text-gray-500 italic font-boldd">Loading your conversation...</div>
            </div>
          </div>
        </>) : (
          <>
            <ChatHeader userInfo={selectedUserInformation} isOnline={isOnline} handleDeselectUser={handleDeselectUser} />
            <ChatBody messages={selectedUserMessages} selectedUserId={selectedUserId} selectedUserName={selectedUserInformation?.fullname} userImage={user?.avatar} selectedUserImage={selectedUserInformation?.avatar} />
            <ChatInput receiverId={selectedUserId} />
          </>
        )
      ) : (<>
        <div className="flex-1 w-full flex justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <MessageCircleMore className="size-10 text-primary" />
            <div className="text-sm text-gray-500 italic font-boldd">Start A Conversation By Selecting A User</div>

          </div>
        </div>
      </>)}
    </div>
  )
}

type ChatHeaderProps = {
  userInfo?: IUser,
  isOnline: boolean,
  handleDeselectUser: () => void
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ userInfo, isOnline, handleDeselectUser }) => {

  return (
    <div className="flex justify-between items-center border-b-1 border-b-black/20 px-6 py-4">
      <div className="flex items-center gap-3">
        <img src={userInfo?.avatar || DefaultUserAvatar} alt="user_avatar" className="w-[50px] h-[50px] object-cover object-center rounded-full" />
        <div className="flex flex-col ">
          <div className="text-lg text-primary font-bold">{userInfo?.fullname || "Username"}</div>
          <div className={`${isOnline ? "text-green-500" : "text-primary"}  text-sm`}>{isOnline ? "Online" : "Offline"}</div>
        </div>
      </div>
      <X className="size-8 text-primary cursor-pointer" onClick={handleDeselectUser} />
    </div>
  )
}


type ChatBodyProps = {
  messages: IChatMessageModel[],
  selectedUserId: string,
  selectedUserName?: string,
  userImage?: string,
  selectedUserImage?: string,
}

const ChatBody: React.FC<ChatBodyProps> = ({ messages, selectedUserId, selectedUserName, userImage, selectedUserImage }) => {

  const chatBoxRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBoxRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])

  return <div className="flex-1 overflow-scroll bg-base-100 p-4" >{
    (messages && messages?.length > 0) ? (<>
      {messages.map((message, index) => {
        const isOwnedChat = message.senderId !== selectedUserId;
        const isNewest = index === messages.length - 1;
        return <ChatBubble
          key={message._id}
          message={message}
          isOwnedChat={isOwnedChat}
          isNewest={isNewest}
          isSendingMessage={false}
          senderName={isOwnedChat ? "You" : selectedUserName || "Other"}
          senderImage={isOwnedChat ? userImage : selectedUserImage} ref={chatBoxRef} />
      })}

    </>) : (<div className="flex justify-center items-center h-full text-gray-500 italic font-bold">
      No messages to show. Start a conversation!
    </div>)

  }</div>
}

type ChatBubbleProps = {
  message: IChatMessageModel,
  isOwnedChat: boolean,
  isNewest: boolean,
  isSendingMessage: boolean
  senderName: string,
  senderImage?: string,
  ref?: RefObject<HTMLDivElement | null>
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isOwnedChat, isNewest, isSendingMessage, senderName, senderImage, ref }) => {
  return <div className={`chat ${isOwnedChat ? "chat-end" : "chat-start"}`} ref={isNewest ? ref : null}>
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



type ChatInputProps = {
  receiverId: string
}

const ChatInput: React.FC<ChatInputProps> = ({ receiverId }) => {
  const dispatch = useAppDispatch();
  const { isSendingMessage } = useAppSelector(state => state.chat);
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<ArrayBuffer | string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target?.files ? e.target.files[0] : null
    if (!file || !file.type.startsWith('image/')) {
      toast.error("Invalid image file")
      return;
    }
    const options = { maxSizeMB: 0.5, maxWidthOrHeight: 300, useWebWorker: true };
    const compressedFile = await imageCompression(file, options);

    const reader = new FileReader();
    reader.readAsDataURL(compressedFile)
    reader.onloadend = () => {
      setImagePreview(reader.result);
    }
  }

  const handleRemovePreviewImage = () => {
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.length > 0 || imagePreview) {
      console.log("Text", text);
      console.log("Image", imagePreview, imageInputRef.current?.files, imageInputRef.current?.value);
      dispatch(sendMessage({ receiverId: receiverId, chatContent: { text, image: imagePreview as string } }))
      setText("");
      setImagePreview(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  }

  return <form onSubmit={handleSubmit} className="w-full">
    {imagePreview && (
      <div className="relative w-fit px-3 py-2">
        <img src={imagePreview as string} alt="preview-image" className="max-w-[100px] max-h-[100px] rounded-md object-cover object-center bg-black" />
        <button onClick={handleRemovePreviewImage} className="absolute top-0 right-0 rounded-full p-1 flex items-center justify-center bg-black text-gray-400 font-bold"><X size={16} /></button>
      </div>
    )}
    <div className="flex p-3 w-full items-center gap-3">
      <input placeholder="Enter your message..." type="text" className="input flex-1" value={text} onChange={(e) => setText(e.target.value)} />
      <input type="file" className="hidden" ref={imageInputRef} onChange={handleImageChange} />
      <button onClick={() => {
        imageInputRef.current?.click();
      }} className="p-2"><Upload size={20} /></button>
      <button type="submit" className="p-2 disabled:text-gray-600" disabled={(!(text.length > 0) && imagePreview == null) || isSendingMessage}>{isSendingMessage ? (<Loader2 size={20} className='animate-spin' />) : (<Send size={20} />)}</button>
    </div>
  </form>
}


