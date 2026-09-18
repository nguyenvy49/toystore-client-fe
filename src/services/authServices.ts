import {get, post} from "@/utils/request";

export const AuthService = {
  login: (data: any) =>
    post<any>("/api/Auth/sign-in", data, {
      requireAuth: false,
      credentials: 'include'
    }),
  auth: (data: { sessionToken: string; expiresAt?: string; roleUser?: string}) =>
    post<any>("/api/auth", data,{
      requireAuth: false,
      baseUrl: ""
    }),
  logout: async (force?: boolean) => {
    try {
      await post("/api/auth/sign-out", { force }, { requireAuth: false,baseUrl: "" });
      return true;
    } catch (err) {
      console.warn("Logout API failed:", err);
      return false;
    }
  },
  getProfile:() => get<any>("/api/Auth/get-profile",{requireAuth:true}),
  signup:(data:any) => post<any>("/api/Auth/sign-up",data)
};