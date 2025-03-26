
export default function Thumbnails() {
    return (
        <div className="hidden lg:flex w-full h-full flex-col justify-center items-center text-center bg-base-200 px-30 py-10 lg:py-0">
            {/* Flickering boxes with tailwind "animate-pulse"*/}
            <div className=" w-full grid grid-cols-3 gap-3 mb-6">
                {[...Array(9)].map((_,index)=>{
                    return <div key={"square"+index} className={`aspect-square rounded-xl bg-primary/10 ${index%2==0? "animate-pulse":""}`}></div>
                })}
            </div>

            <div className="text-2xl text-gray-300 font-extrabold">Join our community</div>
            <p className="text-gray-500">
                Connect with friends, share moments, and stay in touch with your loved ones.
            </p>
        </div>
    )
}
