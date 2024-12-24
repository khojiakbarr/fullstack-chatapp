import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isSended: false,
  isSending: false, // jonatib yuborilmoqda
  isHasBeenSent: false, // jonatib bolindi
  isCheked: false, // chek bolindi
  isSendPassword: false, // parolni o'zgartirildi
  isAgain: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  sendCodeToEmail: async (data) => {
    set({ isSending: true });
    console.log(data);

    try {
      const res = await axiosInstance.post("/auth/send-email", data);
      console.log(res);
      set({ isHasBeenSent: true, isSended: true }); //! code send step
      toast.success("Code has been sent to your email");
    } catch (error) {
      console.log("error in send code to email:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSending: false });
    }
  },

  sendCode: async (data) => {
    set({ isSending: true });
    console.log(data);
    try {
      const res = await axiosInstance.post("/auth/check-code", data);
      toast.success(res.data.message);
      set({ isHasBeenSent: false, isCheked: true, isAgain: false }); //! password send step
    } catch (error) {
      console.log("error in send code to email:", error);
      toast.error(error.response.data.message);
      set({ isAgain: true });
    } finally {
      set({ isSending: false });
    }
  },

  sendPassword: async (data) => {
    set({ isSending: true });
    try {
      const res = await axiosInstance.post("/auth/change-password", data);
      toast.success(res.data.message);
      window.history.back(); // !finished
    } catch (error) {
      console.log("error in change password:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSending: false, isCheked: false, isSended: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
