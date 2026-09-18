"use client";
import React, { useEffect, useState } from "react";
import { GhnService, GhnProvince, GhnDistrict, GhnWard } from "@/services/ghnServices";

interface GhnLocationSelectProps {
  onLocationChange?: (data: {
    provinceId: number | null;
    districtId: number | null;
    wardCode: string | null;
    shippingFee: number;
    locationAddress: string;
  }) => void;
}

export const GhnLocationSelect: React.FC<GhnLocationSelectProps> = ({ onLocationChange }) => {
  const [provinces, setProvinces] = useState<GhnProvince[]>([]);
  const [districts, setDistricts] = useState<GhnDistrict[]>([]);
  const [wards, setWards] = useState<GhnWard[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [shippingFee, setShippingFee] = useState<number>(0);

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [loadingFee, setLoadingFee] = useState(false);

  // Fetch Provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const data = await GhnService.getProvinces();
        setProvinces(data || []);
      } catch (err) {
        console.error("Failed to load provinces:", err);
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch Districts when Province changes
  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value ? Number(e.target.value) : null;
    setSelectedProvince(provinceId);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setDistricts([]);
    setWards([]);
    setShippingFee(0);

    if (provinceId) {
      setLoadingDistricts(true);
      try {
        const data = await GhnService.getDistricts(provinceId);
        setDistricts(data || []);
      } catch (err) {
        console.error("Failed to load districts:", err);
      } finally {
        setLoadingDistricts(false);
      }
    }
  };

  // Fetch Wards when District changes
  const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value ? Number(e.target.value) : null;
    setSelectedDistrict(districtId);
    setSelectedWard(null);
    setWards([]);
    setShippingFee(0);

    if (districtId) {
      setLoadingWards(true);
      try {
        const data = await GhnService.getWards(districtId);
        setWards(data || []);
      } catch (err) {
        console.error("Failed to load wards:", err);
      } finally {
        setLoadingWards(false);
      }
    }
  };

  // Calculate Fee when Ward changes
  const handleWardChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardCode = e.target.value || null;
    setSelectedWard(wardCode);

    if (selectedDistrict && wardCode) {
      setLoadingFee(true);
      try {
        const fee = await GhnService.calculateFee(selectedDistrict, wardCode);
        setShippingFee(fee);

        const provName = provinces.find((p) => p.ProvinceID === selectedProvince)?.ProvinceName || "";
        const distName = districts.find((d) => d.DistrictID === selectedDistrict)?.DistrictName || "";
        const wardName = wards.find((w) => w.WardCode === wardCode)?.WardName || "";
        const locationAddress = [wardName, distName, provName].filter(Boolean).join(", ");

        if (onLocationChange) {
          onLocationChange({
            provinceId: selectedProvince,
            districtId: selectedDistrict,
            wardCode,
            shippingFee: fee,
            locationAddress,
          });
        }
      } catch (err) {
        console.error("Failed to calculate fee:", err);
      } finally {
        setLoadingFee(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 my-4 p-4 border border-blue/20 bg-blue/5 rounded-lg">
      <h3 className="font-semibold text-dark text-base">Địa chỉ vận chuyển GHN</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Province Select */}
        <div>
          <label className="block text-xs font-medium text-dark-4 mb-1">
            Tỉnh / Thành phố <span className="text-red">*</span>
          </label>
          <select
            value={selectedProvince || ""}
            onChange={handleProvinceChange}
            className="w-full bg-white rounded-md border border-gray-3 py-2 px-3 text-sm text-dark outline-none focus:border-blue"
            disabled={loadingProvinces}
          >
            <option value="">-- Chọn Tỉnh / Thành --</option>
            {provinces.map((p) => (
              <option key={p.ProvinceID} value={p.ProvinceID}>
                {p.ProvinceName}
              </option>
            ))}
          </select>
        </div>

        {/* District Select */}
        <div>
          <label className="block text-xs font-medium text-dark-4 mb-1">
            Quận / Huyện <span className="text-red">*</span>
          </label>
          <select
            value={selectedDistrict || ""}
            onChange={handleDistrictChange}
            className="w-full bg-white rounded-md border border-gray-3 py-2 px-3 text-sm text-dark outline-none focus:border-blue"
            disabled={!selectedProvince || loadingDistricts}
          >
            <option value="">-- Chọn Quận / Huyện --</option>
            {districts.map((d) => (
              <option key={d.DistrictID} value={d.DistrictID}>
                {d.DistrictName}
              </option>
            ))}
          </select>
        </div>

        {/* Ward Select */}
        <div>
          <label className="block text-xs font-medium text-dark-4 mb-1">
            Phường / Xã <span className="text-red">*</span>
          </label>
          <select
            value={selectedWard || ""}
            onChange={handleWardChange}
            className="w-full bg-white rounded-md border border-gray-3 py-2 px-3 text-sm text-dark outline-none focus:border-blue"
            disabled={!selectedDistrict || loadingWards}
          >
            <option value="">-- Chọn Phường / Xã --</option>
            {wards.map((w) => (
              <option key={w.WardCode} value={w.WardCode}>
                {w.WardName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loadingFee && <p className="text-xs text-blue">Đang tính phí vận chuyển GHN...</p>}

      {shippingFee > 0 && (
        <div className="flex justify-between items-center bg-white p-2.5 rounded border border-gray-3 text-sm">
          <span className="text-dark font-medium">Phí giao hàng GHN:</span>
          <span className="font-bold text-blue">{shippingFee.toLocaleString("vi-VN")} đ</span>
        </div>
      )}
    </div>
  );
};
