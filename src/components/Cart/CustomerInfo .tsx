import { OrderService } from "@/services/orderServices";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Slide, toast } from "react-toastify";
import { GhnLocationSelect } from "../Checkout/GhnLocationSelect";

interface CustomerInfoProps {
  ghnData: {
    provinceId: number | null;
    districtId: number | null;
    wardCode: string | null;
    shippingFee: number;
    locationAddress: string;
  };
  setGhnData: React.Dispatch<
    React.SetStateAction<{
      provinceId: number | null;
      districtId: number | null;
      wardCode: string | null;
      shippingFee: number;
      locationAddress: string;
    }>
  >;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ ghnData, setGhnData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Phone: "",
    Address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (data: {
    provinceId: number | null;
    districtId: number | null;
    wardCode: string | null;
    shippingFee: number;
    locationAddress: string;
  }) => {
    setGhnData(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.Phone) {
      toast.error("Vui lòng nhập số điện thoại!", { position: "top-center" });
      return;
    }

    if (!ghnData.provinceId || !ghnData.districtId || !ghnData.wardCode) {
      toast.error("Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện và Phường/Xã GHN!", {
        position: "top-center",
      });
      return;
    }

    if (!formData.Address) {
      toast.error("Vui lòng nhập số nhà, tên đường cụ thể!", {
        position: "top-center",
      });
      return;
    }

    const fullAddress = `${formData.Address}, ${ghnData.locationAddress}`;

    const orderPayload = {
      Phone: formData.Phone,
      Address: fullAddress,
      ProvinceId: ghnData.provinceId,
      DistrictId: ghnData.districtId,
      WardCode: ghnData.wardCode,
      ShippingFee: ghnData.shippingFee,
    };

    setLoading(true);
    try {
      const res = await OrderService.createOrder(orderPayload);
      if (res?.success !== false) {
        toast.success("Đặt hàng thành công!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
        });
        router.push("/my-account?tab=orders");
      } else {
        toast.error(res?.message || "Đặt hàng thất bại!", {
          position: "top-center",
        });
      }
    } catch (error: any) {
      console.error("Order submit error:", error);
      toast.error(
        error?.response?.data?.message || "Đặt hàng thất bại! Vui lòng kiểm tra lại.",
        {
          position: "top-center",
          autoClose: 3000,
          theme: "light",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:max-w-[670px] w-full">
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-1 rounded-[10px]">
          <div className="border-b border-gray-3 py-5 px-4 sm:px-5.5">
            <h3 className="font-medium text-dark text-xl">Thông tin khách hàng</h3>
          </div>

          <div className="py-6 px-4 sm:px-8.5">
            <div className="flex flex-col gap-4">
              {/* Phone input */}
              <div>
                <label className="block text-sm font-medium text-dark mb-1">
                  Số điện thoại <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  name="Phone"
                  value={formData.Phone}
                  onChange={handleChange}
                  required
                  placeholder="Nhập số điện thoại"
                  className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 text-sm"
                />
              </div>

              {/* GHN Location Selection */}
              <GhnLocationSelect onLocationChange={handleLocationChange} />

              {/* Specific street address */}
              <div>
                <label className="block text-sm font-medium text-dark mb-1">
                  Số nhà / Tên đường cụ thể <span className="text-red">*</span>
                </label>
                <textarea
                  name="Address"
                  value={formData.Address}
                  onChange={handleChange}
                  placeholder="Ví dụ: Số 123 đường ABC..."
                  required
                  className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 resize-none text-sm"
                  rows={2}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`font-medium text-white bg-blue py-3 px-8 rounded-md ease-out duration-200 hover:bg-blue-dark text-center mt-2 ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Đang xử lý..." : "Thanh toán"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerInfo;
