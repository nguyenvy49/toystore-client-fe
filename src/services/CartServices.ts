
import { del, get,post, put } from "@/utils/request";

export const CartService = {
    getCart: (url: string) => get<any>(url,{requireAuth:true}),
    addCart:(data:any) => post<any>("/api/Cart",data,{requireAuth:true}),
    updateCart:(data:any) => put<any>("/api/Cart/update",data,{requireAuth:true}),
    deleteCart:(id:string) => del<any>("/api/Cart/delete",id,{requireAuth:true})
};