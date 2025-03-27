import { ChatContent } from "./components/ChatContent";
import { Sidebar } from "./components/Sidebar";

export default function Home() {


 
  return (
    <div className="flex justify-center items-center py-10">
      <div className="h-[80vh] flex min-w-[1000px] bg-base-200 shadow-lg shadow-black/30 rounded-md">
        <Sidebar/>
        <ChatContent/>
      </div>
    </div>
  )
}
