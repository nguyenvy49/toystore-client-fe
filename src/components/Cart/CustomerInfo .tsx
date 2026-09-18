import { OrderService } from "@/services/orderServices";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Slide, toast } from "react-toastify";


const CustomerInfo = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        Phone: "",
        Address: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Xử lý dữ liệu form ở đây, ví dụ gửi API hoặc lưu state
        console.log("Thông tin khách hàng:", formData);
        try {
            const res = await OrderService.createOrder(formData)
            console.log(res)
            if (res.success) {
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
                router.push("/")
            }
        } catch (error) {
            toast.error("Đặt hàng thất bại!", {
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
        }

    };

    return (
        <div className="lg:max-w-[670px] w-full">
            <form onSubmit={handleSubmit}>
                <div className="bg-white shadow-1 rounded-[10px]">
                    <div className="border-b border-gray-3 py-5 px-4 sm:px-5.5">
                        <h3>Thông tin khách hàng</h3>
                    </div>

                    <div className="py-8 px-4 sm:px-8.5">
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                name="Phone"
                                value={formData.Phone}
                                onChange={handleChange}
                                required
                                placeholder="Số điện thoại"
                                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                            />

                            <textarea
                                name="Address"
                                value={formData.Address}
                                onChange={handleChange}
                                placeholder="Địa chỉ"
                                required
                                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 resize-none"
                                rows={3}
                            />

                            <button
                                type="submit"
                                className="font-medium text-white bg-blue py-3 px-8 rounded-md ease-out duration-200 hover:bg-blue-dark text-center"
                            >
                                Thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CustomerInfo;
