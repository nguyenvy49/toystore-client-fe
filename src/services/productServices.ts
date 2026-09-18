
import {  get } from "@/utils/request";

export const ProductService = {
  getProduct:(url:string)=>get<any>(url),
};