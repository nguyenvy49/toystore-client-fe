
import { get } from "@/utils/request";

export const blogService = {
  getListBlog: (url: string) => get<any>(url),
  getDetail: (id: string) => get<any>(`/api/News/${id}`),
  //   createCategory:(data:any)=>post<any>("/api/Category/Category",data,{requireAuth:true}),
  //   infoCategory:(id:string)=>get<any>(`/api/Category/${id}`,{requireAuth:true}),
  //   updateCategory:(id:string,data:any)=>put<any>(`/api/Category/${id}`,data,{requireAuth:true}),
  //   deleteCategory:(id:string)=>del<any>(`/api/Category`,`${id}?force=true`,{requireAuth:true}),
  //   restoreCategory:(id:string)=>put<any>(`/api/Category/restore?idcategory=${id}`,undefined,{requireAuth:true}),
};