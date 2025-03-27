import { axiosInstance } from "@/axios/axiosInstance";
import { IUser } from "@/types/user.type";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum CHAT_ENUM {
  MAX_MESSAGE_PER_SCROLL = 5,
}

export interface IChatContent {
  text?: string;
  image?: string;
}
export interface IChatMessageModel extends IChatContent {
  senderId: string;
  receiverId: string;
  createdAt?: string;
  _id?: string;
}

export interface IChatState {
  onlineUsers: string[];
  allUsers: IUser[];
  selectedUserId: string;
  selectedUserMessages: IChatMessageModel[];
  loadingChat: boolean;
  loadingAllUsers: boolean;
  isSendingMessage: boolean;
  error: string | null;
  topMessageId?: string | null;
  hasMore: boolean;
}

const initialChatState: IChatState = {
  onlineUsers: [],
  allUsers: [],
  selectedUserId: "",
  selectedUserMessages: [],
  loadingChat: false,
  loadingAllUsers: false,
  isSendingMessage: false,
  error: null,
  topMessageId: null,
  hasMore: true,
};

export type sendMessageParams = {
  receiverId: string;
  chatContent: IChatContent;
};

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    { receiverId, chatContent }: sendMessageParams,
    { rejectWithValue }
  ) => {
    try {
      const { text, image } = chatContent;
      const response = await axiosInstance.post("/message/send/" + receiverId, {
        text,
        image,
      });
      return response.data;
    } catch (error) {
      rejectWithValue(error || "Error sending message");
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "chat/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/message/users");
      return response.data;
    } catch (error) {
      rejectWithValue(error || "Error fetching users");
    }
  }
);

// export const getSelectedUserMessages = createAsyncThunk(
//   "chat/getSelectedUserMessages",
//   async (receiverId: string, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get("/message/" + receiverId);
//       return response.data;
//     } catch (error) {
//       rejectWithValue(error || "Error fetching users");
//     }
//   }
// );

// Update for infinite scrolling
export const getSelectedUserMessages = createAsyncThunk(
  "chat/getSelectedUserMessages",
  async (
    {
      receiverId,
      topMessageId,
      limit,
    }: { receiverId: string; topMessageId?: string; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const queryParams: { topMessageId?: string; limit?: number } = {};
      if (topMessageId) {
        queryParams.topMessageId = topMessageId;
        queryParams.limit =
          limit && Number(limit) ? limit : CHAT_ENUM.MAX_MESSAGE_PER_SCROLL;
      }
      const response = await axiosInstance.get(
        "/message/cursor/" + receiverId,
        {
          params: {
            ...queryParams,
          },
        }
      );
      return response.data;
    } catch (error) {
      rejectWithValue(error || "Error fetching users");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: initialChatState,
  reducers: {
    receiveMessage: (state, action: PayloadAction<IChatMessageModel>) => {
      state.selectedUserMessages.push(action.payload);
    },
    updateOnlineUsers(state, action: PayloadAction<string[]>) {
      console.log("Slice updateOnlineUsers", action.payload);
      state.onlineUsers = action.payload;
    },
    selectNewUser(state, action: PayloadAction<string>) {
      state.selectedUserId = action.payload;
    },
    resetSelectedUserMessages(state) {
      state.selectedUserMessages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isSendingMessage = true;
      })
      .addCase(
        sendMessage.fulfilled,
        (
          state,
          action: PayloadAction<{
            newMessage: IChatMessageModel;
          }>
        ) => {
          state.isSendingMessage = false;
          state.selectedUserMessages.push(action.payload.newMessage);
        }
      )
      .addCase(sendMessage.rejected, (state, action) => {
        state.isSendingMessage = false;
        state.error = action.payload as string;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.loadingAllUsers = true;
      })
      .addCase(
        getAllUsers.fulfilled,
        (state, action: PayloadAction<{ users: IUser[] }>) => {
          state.loadingAllUsers = false;
          state.allUsers = action.payload.users;
        }
      )
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loadingAllUsers = false;
        state.error = action.payload as string;
      })
      .addCase(getSelectedUserMessages.pending, (state) => {
        state.loadingChat = true;
      })
      .addCase(
        getSelectedUserMessages.fulfilled,
        (
          state,
          action: PayloadAction<{
            allMessages: IChatMessageModel[];
          }>
        ) => {
          console.log(
            "Selected User Message: " +
              action.payload?.allMessages.map(
                (m) => "\n Id:" + (m._id || "") + "Date: " + m.createdAt + "\n"
              )
          );
          state.topMessageId =
            action.payload.allMessages.length > 0
              ? action.payload.allMessages[
                  action.payload.allMessages.length - 1
                ]._id
              : null;
          state.hasMore = !(action.payload.allMessages.length < 5);
          state.selectedUserMessages = [
            ...action.payload.allMessages.reverse(),
            ...state.selectedUserMessages,
          ];
          console.log("Top Message Id: " + state.topMessageId);
          state.loadingChat = false;
        }
      )
      .addCase(getSelectedUserMessages.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loadingChat = false;
      });
  },
});
export const {
  receiveMessage,
  updateOnlineUsers,
  selectNewUser,
  resetSelectedUserMessages,
} = chatSlice.actions;
export default chatSlice.reducer;
