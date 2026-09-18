
import { get, post } from "@/utils/request";

export const accountService = {
    getAccount: (url: string) => get<any>(url,{requireAuth:true}),
    //   createCategory:(data:any)=>post<any>("/api/Category/Category",data,{requireAuth:true}),
    //   infoCategory:(id:string)=>get<any>(`/api/Category/${id}`,{requireAuth:true}),
    updateAccount: (id: string, data: any) => post<any>(`/api/Auth/profile?userId=${id}`, data, { requireAuth: true }),
    updatePassword: (data: any) => post<any>(`/api/Auth/change-password`, data, { requireAuth: true }),
    //   deleteCategory:(id:string)=>del<any>(`/api/Category`,`${id}?force=true`,{requireAuth:true}),
    //   restoreCategory:(id:string)=>put<any>(`/api/Category/restore?idcategory=${id}`,undefined,{requireAuth:true}),
};