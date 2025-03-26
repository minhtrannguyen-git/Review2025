import { configureStore } from "@reduxjs/toolkit";
import authSlice from './slices/authSlice'
import chatSlice from './slices/chatSlice'
import createSagaMiddleware from "redux-saga";
import chatSaga from "./middlewares/chatSaga";
import { all } from "redux-saga/effects";

const sagaMiddleware = createSagaMiddleware();


export const store = configureStore({
    reducer:{
        auth: authSlice,
        chat: chatSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware)
})
sagaMiddleware.run(rootSaga);

export function* rootSaga() {
    yield all([
      chatSaga(),
    ])
  }
  
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

