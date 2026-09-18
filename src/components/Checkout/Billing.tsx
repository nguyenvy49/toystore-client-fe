"use client";
import React from "react";
import { GhnLocationSelect } from "./GhnLocationSelect";

interface BillingProps {
  formData: {
    fullName: string;
    phone: string;
    address: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLocationChange?: (data: {
    provinceId: number | null;
    districtId: number | null;
    wardCode: string | null;
    shippingFee: number;
    locationAddress: string;
  }) => void;
}

const Billing: React.FC<BillingProps> = ({ formData, onChange, onLocationChange }) => {
  return (
    <div className="mt-9">
      <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
        Thông tin giao hàng
      </h2>

      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
          <div className="w-full">
            <label htmlFor="fullName" className="block mb-2.5">
              Họ và tên <span className="text-red">*</span>
            </label>

            <input
              type="text"
              name="fullName"
              id="fullName"
              value={formData.fullName}
              onChange={onChange}
              placeholder="Nguyễn Văn A"
              required
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div className="w-full">
            <label htmlFor="phone" className="block mb-2.5">
              Số điện thoại <span className="text-red">*</span>
            </label>

            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={onChange}
              placeholder="0912345678"
              required
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>
        </div>

        {/* GHN Location Selection */}
        <GhnLocationSelect onLocationChange={onLocationChange} />

        <div className="mb-5 mt-5">
          <label htmlFor="address" className="block mb-2.5">
            Số nhà / Tên đường cụ thể
            <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="address"
            id="address"
            value={formData.address}
            onChange={onChange}
            placeholder="Số nhà, tên đường..."
            required
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>
      </div>
    </div>
  );
};

export default Billing;
