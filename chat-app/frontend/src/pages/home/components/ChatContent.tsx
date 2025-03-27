import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getSelectedUserMessages, resetSelectedUserMessages, selectNewUser } from "@/redux/slices/chatSlice";
import { Loader, MessageCircleMore } from "lucide-react";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { ChatBody } from './chat-content-components/ChatBody';
import { ChatHeader } from './chat-content-components/ChatHeader';
import { ChatInput } from './chat-content-components/ChatInput';


export const ChatContent = () => {
  const { selectedUserId, selectedUserMessages, allUsers, onlineUsers, loadingChat, topMessageId, hasMore } = useAppSelector(state => state.chat);
  const { user } = useAppSelector(state => state.auth)

  const [isLoadingMoreMessageVisible, setIsLoadingMoreMessageVisible] = useState(false);

  const [shouldScrollIntoView, setShouldScrollIntoView] = useState(true);

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (selectedUserId) {
      dispatch(resetSelectedUserMessages())
      dispatch(getSelectedUserMessages({ receiverId: selectedUserId, limit: 10 }))
      setShouldScrollIntoView(true);
    }
  }, [selectedUserId])

  const [selectedUserInformation, isOnline] = useMemo(() => {
    return [allUsers.find(u => u._id === selectedUserId), onlineUsers.includes(selectedUserId)]
  }, [selectedUserId, allUsers, onlineUsers])

  const handleDeselectUser = () => {
    dispatch(selectNewUser(""));
    setShouldScrollIntoView(true);
  }

  // A ref to check if user scroll to the top message => fetch more messages
  const topMessageRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (!topMessageId || !topMessageRef.current) return;
      observerRef.current = new IntersectionObserver(
        (entries) => {
          console.log("Intersecting")
          if (entries[0].isIntersecting && hasMore) {
            setIsLoadingMoreMessageVisible(true);
            setShouldScrollIntoView(false)
            console.log("Top message is visible, loading more...");
            dispatch(getSelectedUserMessages({ receiverId: selectedUserId, limit: 5, topMessageId })).finally(() => {
              setIsLoadingMoreMessageVisible(false)
            });
          }
        },
        { root: null, rootMargin: "0px", threshold: 1.0 }
      );

      observerRef.current.observe(topMessageRef.current);
    }, 1000)

    return () => {
      observerRef.current?.disconnect();
    };
  }, [topMessageId, selectedUserId]);


  return (
    <div className="flex flex-col w-full">
      {selectedUserId ? (
        loadingChat && shouldScrollIntoView ? (<>
          <div className="flex-1 w-full flex justify-center items-center">
            <div className="flex flex-col items-center gap-3">
              <Loader className="size-10 text-primary animate-spin" />
              <div className="text-sm text-gray-500 italic font-boldd">Loading your conversation...</div>
            </div>
          </div>
        </>) : (
          <>
            <ChatHeader userInfo={selectedUserInformation} isOnline={isOnline} handleDeselectUser={handleDeselectUser} />
            <ChatBody
              messages={selectedUserMessages}
              selectedUserId={selectedUserId}
              selectedUserName={selectedUserInformation?.fullname}
              userImage={user?.avatar}
              selectedUserImage={selectedUserInformation?.avatar}
              topMessageRef={topMessageRef}
              isLoadingMoreMessageVisible={isLoadingMoreMessageVisible}
              loadingChat={loadingChat}
              topMessageId={topMessageId}
              shoudlScrollIntoView={shouldScrollIntoView}
              hasMore={hasMore}
            />
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



