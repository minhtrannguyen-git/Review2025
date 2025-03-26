import { IUser } from "@/types/user.type"
import { Users } from "lucide-react"
import { useEffect, useState } from "react"
import DefaultAvatar from '@/assets/Default_pfp.jpg';
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAllUsers, selectNewUser } from "@/redux/slices/chatSlice";
import toast from "react-hot-toast";

export const Sidebar = () => {

  const { allUsers, onlineUsers, selectedUserId, loadingAllUsers, error } = useAppSelector(state => state.chat);

  const dispatch = useAppDispatch();


  const handleSelectUser = (userId: string) => {
    dispatch(selectNewUser(userId));
  }

  useEffect(() => {
    dispatch(getAllUsers());
  }, [])

  useEffect(() => {
    if(error){
      toast.error(error);
    }
  }, [error])


  return (
    <div className="lg:min-w-[300px] min-w-[100px] flex flex-col border-r-1 border-r-black/20">
      {/* Title & Filtering session */}
      <div className="text-primary p-4 border-b-1 border-b-black/20">
        <div className="flex items-center gap-3 font-bold mb-3 ">
          <Users />
          Contacts
        </div>
        <div className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="checkbox" />
          Show online only <span className="text-gray-600">{`(${onlineUsers.length} online)`}</span>
        </div>
      </div>

      {
        loadingAllUsers ? (
          <div className="overflow-hidden">
            {[...Array(10)].map((_, index) => {
              return (
                <div className="flex items-center gap-4 py-3 px-2" key={index}>
                  <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                  <div className="flex flex-col gap-4">
                    <div className="skeleton h-4 w-20"></div>
                    <div className="skeleton h-4 w-28"></div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col overflow-scroll py-3">
            {allUsers?.map(user => <SidebarUser key={user._id} userInfo={user} handleSelectUser={handleSelectUser} isOnline={onlineUsers.includes(user._id)} isSelected={selectedUserId == user._id} />)}
          </div>
        )
      }
    </div>
  )
}

type SidebarUserProps = {
  userInfo: IUser,
  handleSelectUser: (userId: string) => void,
  isOnline: boolean,
  isSelected: boolean
}

const SidebarUser: React.FC<SidebarUserProps> = ({ userInfo, handleSelectUser, isOnline, isSelected }) => {

  return <div className={`cursor-pointer hover:bg-base-300 p-3 flex items-center gap-3 ${isSelected ? "bg-base-300" : ""}`} onClick={() => handleSelectUser(userInfo._id)}>
    <div className="relative">
      <img src={userInfo.avatar || DefaultAvatar} alt="user_avatar" className="w-[50px] h-[50px] object-cover object-center rounded-full " />
      {
        isOnline && <span className="absolute top-0 right-0 w-[12px] h-[12px] bg-green-500 rounded-full shadow-sm shadow-black/50"></span>
      }
    </div>
    <div className="flex flex-col">
      <span className="text-primary font-bold">{userInfo.fullname}</span>
      <span className={`text-[12px] font-bold ${isOnline ? "text-green-500" : "text-gray-300"}`}>{isOnline ? "Online" : "Offline"}</span>
    </div>
  </div>
}
