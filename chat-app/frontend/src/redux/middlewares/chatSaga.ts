import { io, Socket } from "socket.io-client";
import { call, cancel, fork, put, select, take } from "redux-saga/effects";
import { RootState } from "../store";
import {
  checkAuthStatus,
  loginUser,
  logoutUser,
  signupUser,
} from "../slices/authSlice";
import { EventChannel, eventChannel, Task } from "redux-saga";
import {
  IChatMessageModel,
  receiveMessage,
  sendMessage,
  updateOnlineUsers,
} from "../slices/chatSlice";

function connectSocket(userId: string) {
  console.log("Connect Socket is called");
  const url = import.meta.env.VITE_BACKEND_SOCKET_URL;
  if (!url) return;

  const socket = io(url, {
    query: {
      userId,
    },
  });

  return new Promise((resolve) => {
    socket.on("connect", () => {
      console.log("Connected to SocketIO");
      resolve(socket);
    });
  });
}
// Socket flow
function* socketFlow(userId: string) {
  const socket: Socket = yield call(connectSocket, userId);

  const task:Task = yield fork(handleIO, socket);
  // When logged out, disconnect socket
  yield take(logoutUser.fulfilled.type);
  console.log("Saga detected logged out");
  yield cancel(task);
  socket.disconnect();
}

function createMessageEventChannel(socket: Socket) {
  return eventChannel((emitter) => {
    socket.on("receive-message", (message: IChatMessageModel) => {
      emitter(message);
    });
    return () => {
      socket.off("receive-message");
    };
  });
}

function* ioReceiveMessage(socket: Socket) {
  const channel: EventChannel<IChatMessageModel> = yield call(
    createMessageEventChannel,
    socket
  );
  try {
    while (true) {
      const message: IChatMessageModel = yield take(channel);
      yield put(receiveMessage(message));
    }
  } finally {
    channel.close();
  }
}

function createOnlineUsersChannel(socket: Socket) {
  return eventChannel((emitter) => {
    socket.emit('request-online-users');
    socket.on("online-users", (users: string[]) => {
      emitter(users);
    });
    return () => {
    console.log("Online user Socket is closed")

      socket.off("online-users");
    };
  });
}

function* ioOnlineUsers(socket: Socket) {
  const channel: EventChannel<string[]> = yield call(
    createOnlineUsersChannel,
    socket
  );
  try {
    while (true) {
      const users: string[] = yield take(channel);
      console.log("Online Users", users);
      if(users){
        const userId:string = yield select((state: RootState) => state.auth.user?._id);
        yield put(updateOnlineUsers(users.filter(user => user !== userId)));
      }
    }
  } finally {
    console.log("Online user channel is closed")
    channel.close();
  }
}

function* handleIO(socket: Socket) {
  yield fork(ioReceiveMessage, socket);
  yield fork(ioOnlineUsers, socket);
}

// Normal Flow, if user logged in then activate socket flow
function* flow() {
  while (true) {
    yield take([checkAuthStatus.fulfilled.type, checkAuthStatus.rejected.type]);

    while (true) {
      const isFinishedCheckingAuth: boolean = yield select(
        (state: RootState) => state.auth.isFinishedCheckingAuth
      );
      const isCheckAuth: boolean = yield select(
        (state: RootState) => state.auth.isCheckAuth
      );
      console.log("Finish Checking: ", isFinishedCheckingAuth);
      if (isFinishedCheckingAuth) {
        console.log("Finished checking is called");

        console.log("Checking Auth is", isCheckAuth);
        if (isCheckAuth) {
          const userId: string = yield select(
            (state: RootState) => state.auth.user?._id
          );
          console.log("User Id is", userId)
          if (userId) {
            yield fork(socketFlow, userId);
          }
        }
      }

      yield take([loginUser.fulfilled.type, signupUser.fulfilled.type]);
    }
  }
}


export default function* chatSaga() {
  yield fork(flow);
}
