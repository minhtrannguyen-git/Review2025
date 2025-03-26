import { LoginFormData, SignupFormData } from "@/types/authForm.type";
import { axiosInstance } from "../../axios/axiosInstance";
import { IUser } from "../../types/user.type";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export interface IAuthState {
  user: IUser | null;
  loading: boolean;
  error: string | null;
  isCheckAuth: boolean; // If current user has a valid cookke
  isFinishedCheckingAuth: boolean; // If the "cookies checking process finished" => only do it once every session.
}

const initialAuthState: IAuthState = {
  user: null,
  loading: false,
  error: null,
  isCheckAuth: false, // ✅ Initially false, updated when checking auth, cookie token valid => true, else false
  isFinishedCheckingAuth:false,
};

// ✅ CHECK AUTHENTICATION STATUS
export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/check"); // Calls backend to check JWT
      console.log("Successfully authorized user");
      return response.data; // Should return user data if authenticated
    } catch (error: any) {
      return rejectWithValue("Not authenticated"); // If failed, user is not authenticated
    }
  }
);

// ✅ SIGNUP
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (credentials: SignupFormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/signup", credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error || "Signup failed");
    }
  }
);

// ✅ LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginFormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error || "Login failed");
    }
  }
);

// ✅ UPDATE PROFILE
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (base64Img: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/update-profile", {
        avatar: base64Img,
      });

      toast.success("Successfully updated profile")
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error || "Update profile failed");
    }
  }
);

// ✅ LOGOUT
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout");
      return null;
    } catch (error: any) {
      return rejectWithValue(error || "Logout failed");
    }
  }
);

// ✅ REDUX SLICE
const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    startLoading(state) {
      state.loading = true;
    },
    endLoading(state) {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 CHECK AUTH STATUS
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        checkAuthStatus.fulfilled,
        (state, action: PayloadAction<IUser>) => {
          state.loading = false;
          state.user = action.payload;
          state.isCheckAuth = true; // ✅ Auth checked successfully
          state.isFinishedCheckingAuth = true;
        }
      )
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isCheckAuth = false;
        state.isFinishedCheckingAuth = true;
      })

      // 🔹 SIGNUP
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.loading = false;
        state.user = action.payload;
        state.isCheckAuth = true; // ✅ Auth checked successfully
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.isCheckAuth = false; // ✅ Auth checked successfully
        state.error = action.payload as string;
      })

      // 🔹 LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.loading = false;
        state.user = action.payload;
        state.isCheckAuth = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isCheckAuth = false;
      })
      // 🔹 Updating user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateUserProfile.fulfilled,
        (state, action: PayloadAction<IUser>) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔹 LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isCheckAuth = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {startLoading, endLoading} = authSlice.actions;
export default authSlice.reducer;
