import { IUser } from "@/types/user.type"
import DefaultUserAvatar from "@/assets/Default_pfp.jpg"
import { X } from "lucide-react"

type ChatHeaderProps = {
    userInfo?: IUser,
    isOnline: boolean,
    handleDeselectUser: () => void
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ userInfo, isOnline, handleDeselectUser }) => {
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