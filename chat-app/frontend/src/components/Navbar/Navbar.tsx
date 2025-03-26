import { useAppDispatch } from "@/redux/hooks";
import { logoutUser } from "@/redux/slices/authSlice";
import { LogOut, MessageSquare, Settings, User } from "lucide-react"
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        navigate('/login')
        await dispatch(logoutUser())
    }

    const handleProfileClick = () => {
        navigate('/profile');
    }

    const handleHomeClick = () => {
        navigate('/')
    }

    return (
        <div className="w-full flex justify-between lg:px-20 sm:px-4 px-2 items-center py-4 border-b-1 border-b-gray-900">
            <div className="left-side flex items-center cursor-pointer" onClick={handleHomeClick}>
                <div className='p-2 bg-indigo-900 rounded-md text-indigo-300'>
                    <MessageSquare />
                </div>
                <p className="ms-2.5 font-bold text-xl text-white">Chatty</p>

            </div>
            <div className="right-side flex gap-3 text-sm">
                <button className="cursor-pointer min-w-[120px] h-auto px-4 py-2 bg-base-300 hover:bg-base-200 text-white font-bold rounded-md flex justify-center items-center">
                    <Settings className="size-4" />
                    <span className="inline-block ms-2">Settings</span>
                </button>
                <button onClick={handleProfileClick} className="cursor-pointer min-w-[120px] h-auto px-4 py-2 bg-base-300 hover:bg-base-200 text-white font-bold rounded-md flex justify-center items-center">
                    <User className="size-4" />
                    <span className="inline-block ms-2">Profile</span>
                </button>
                <button onClick={handleLogout} className="cursor-pointer rounded-md px-4 py-2 flex gap-3 ms-4 items-center hover:shadow-amber-100 hover:shadow-md transition-shadow duration-500">
                    <LogOut />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    )
}
