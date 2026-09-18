import { get, post } from "@/utils/request";

export interface GhnProvince {
  ProvinceID: number;
  ProvinceName: string;
  Code: string;
}

export interface GhnDistrict {
  DistrictID: number;
  ProvinceID: number;
  DistrictName: string;
  Code: string;
}

export interface GhnWard {
  WardCode: string;
  DistrictID: number;
  WardName: string;
}

export const GhnService = {
  getProvinces: async () => {
    const res = await get<any>("/api/Ghn/provinces");
    return (res?.data || res?.result || res || []) as GhnProvince[];
  },
  getDistricts: async (provinceId: number) => {
    const res = await get<any>(`/api/Ghn/districts/${provinceId}`);
    return (res?.data || res?.result || res || []) as GhnDistrict[];
  },
  getWards: async (districtId: number) => {
    const res = await get<any>(`/api/Ghn/wards/${districtId}`);
    return (res?.data || res?.result || res || []) as GhnWard[];
  },
  calculateFee: async (toDistrictId: number, toWardCode: string, weight: number = 500) => {
    const res = await post<any>("/api/Ghn/fee", { toDistrictId, toWardCode, weight });
    return (res?.data ?? res?.result ?? res ?? 30000) as number;
  }
};
