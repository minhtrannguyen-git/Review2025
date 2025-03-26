import defaultUserProfileImg from '@/assets/Default_pfp.jpg';
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { checkAuthStatus, startLoading, updateUserProfile } from "@/redux/slices/authSlice";
import imageCompression from 'browser-image-compression';
import { Camera, Loader2, Mail, User } from "lucide-react";
import { ChangeEvent, useEffect, useRef } from "react";
import toast from 'react-hot-toast';

export const Profile = () => {
    const imageInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();

    const handleCameraClick = () => {
        imageInputRef.current?.click();
    }

    const { user, loading, error, isCheckAuth } = useAppSelector(state => state.auth);

    


    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        if (!file) return;

        try {
            // Compress the image before uploading
            dispatch(startLoading());
            const options = { maxSizeMB: 0.5, maxWidthOrHeight: 300, useWebWorker: true };
            const compressedFile = await imageCompression(file, options);

            // Convert to Base64
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onload = async () => {
                const base64Image = reader.result as string;
                if (!base64Image) return;
                await dispatch(updateUserProfile(base64Image));
            };
        } catch (error) {
            console.error("Image compression failed", error);
        }
    }

    useEffect(() => {
        if (error) toast.error(error)
    }, [error])
    

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="p-10 bg-base-300 rounded-md flex flex-col items-center min-w-[800px]">
                <p className="text-3xl font-bold mb-3">Profile</p>
                <p className="mb-3 text-gray-300">Your profile information</p>
                {/* Image input */}
                <div className="relative">
                    {loading ? (
                        <Loader2 className="size-24 animate-spin text-gray-500" />
                    ) : (
                        <img src={user?.avatar || defaultUserProfileImg} className="p-2 border-2 border-white bg-black rounded-full w-[250px] h-[250px] object-cover object-center" />
                    )}
                    <div onClick={handleCameraClick} className="absolute right-0 bottom-0 p-2 bg-gray-400 rounded-full min-w-[50px] min-h-[50px] flex items-center justify-center hover:bg-gray-300 cursor-pointer transition-colors duration-200 ease-in">
                        <Camera className="text-black" />
                    </div>
                    <input onChange={handleImageUpload} disabled={loading} className="hidden" type="file" accept="image/*" ref={imageInputRef} />

                </div>
                <p className="my-3 text-gray-300">Click the camera icon to update your photos</p>


                <div className="w-full text-gray-400">
                    <div className="flex items-center gap-2 mb-2">
                        <User className="size-5" />
                        <p>Full Name</p>
                    </div>
                    <div className="p-2 ps-4 w-full border-2 border-gray-400 rounded-md">
                        {user?.fullname || "User name"}
                    </div>
                </div>
                <div className="w-full mt-4 text-gray-400">
                    <div className="flex items-center gap-2 mb-2">
                        <Mail className="size-5" />
                        <p>Email Address</p>
                    </div>
                    <div className="p-2 ps-4 w-full border-2 border-gray-400 rounded-md">
                        {user?.email || "User email"}
                    </div>
                </div>

                <div className="w-full mt-10">
                    <p className="text-xl font-bold">Account Information</p>
                    <div className="border-b-1 p-4 border-b-white/50 mb-2.5 flex justify-between">
                        <p>Member Since</p>
                        <p>{user?.createdAt || "Unknown timeline"}</p>
                    </div>
                    <div className=" p-4 mb-2.5 flex justify-between">
                        <p>Account Status</p>
                        <p className="text-green-500 font-bold">Active</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
