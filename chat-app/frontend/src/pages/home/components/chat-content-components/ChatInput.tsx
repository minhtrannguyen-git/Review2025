import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import imageCompression from 'browser-image-compression';
import { sendMessage } from "@/redux/slices/chatSlice";
import { Loader2, Send, Upload, X } from "lucide-react";

type ChatInputProps = {
    receiverId: string
}

export const ChatInput: React.FC<ChatInputProps> = ({ receiverId }) => {
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
            <button type='button' onClick={() => {
                imageInputRef.current?.click();
            }} className="p-2"><Upload size={20} /></button>
            <button type="submit" className="p-2 disabled:text-gray-600" disabled={(!(text.length > 0) && imagePreview == null) || isSendingMessage}>{isSendingMessage ? (<Loader2 size={20} className='animate-spin' />) : (<Send size={20} />)}</button>
        </div>
    </form>
}


