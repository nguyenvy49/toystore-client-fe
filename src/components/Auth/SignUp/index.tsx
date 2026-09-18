"use client"
import Breadcrumb from "@/components/Common/Breadcrumb";
import { AuthService } from "@/services/authServices";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Slide, toast } from "react-toastify";

const Signup = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    gender: 0,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Cập nhật form
    setForm(prev => ({ ...prev, [name]: value }));

    // Xóa lỗi nếu có
    setErrors(prev => {
      const newErrors = { ...prev };
      if (newErrors[name]) delete newErrors[name];
      return newErrors;
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error = "";

    switch (name) {
      case "fullName":
        if (!value.trim()) error = "Tên tài khoản không được để trống";
        break;
      case "email":
        if (!value.trim()) error = "Email không được để trống";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Email không hợp lệ";
        break;
      case "password":
        if (!value.trim()) error = "Mật khẩu không được để trống";
        break;
      case "confirmPassword":
        if (!value.trim()) error = "Nhập lại mật khẩu không được để trống";
        else if (value !== form.password)
          error = "Mật khẩu nhập lại không trùng khớp";
        break;
      case "phone":
        if (value && !/^[0-9]*$/.test(value))
          error = "Số điện thoại chỉ được nhập số";
        break;
      case "address":
        if (!value.trim()) error = "Địa chỉ không được để trống";
        break;
      case "gender":
        // value là string, cần ép sang number
        if (form.gender !== 0 && form.gender !== 1) error = "Vui lòng chọn giới tính";
        break;
      default:
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, gender: Number(e.target.value) }));
    setErrors(prev => ({ ...prev, gender: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // Kiểm tra bắt buộc
    if (!form.fullName.trim()) newErrors.fullName = "Tên tài khoản không được để trống";
    if (!form.email.trim()) newErrors.email = "Email không được để trống";
    if (!form.password.trim()) newErrors.password = "Mật khẩu không được để trống";
    if (!form.confirmPassword.trim()) newErrors.confirmPassword = "Nhập lại mật khẩu không được để trống";
    if (!form.address.trim()) newErrors.address = "Địa chỉ không được để trống";
    if (!form.phone.trim()) newErrors.phone = "Số điện thoại không được để trống";
    if (form.gender !== 0 && form.gender !== 1) newErrors.gender = "Vui lòng chọn giới tính";

    // Kiểm tra email
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Email không hợp lệ";

    // Kiểm tra mật khẩu trùng
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu nhập lại không trùng khớp";
    }

    // Kiểm tra số điện thoại
    if (form.phone && !/^[0-9]*$/.test(form.phone)) newErrors.phone = "Số điện thoại chỉ được nhập số";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form hợp lệ, gửi dữ liệu:", form);
      // Gọi API signup ở đây
      try {
        const res = await AuthService.signup(form);
        console.log(res);
        if (res.success) {
          toast.success("Đăng kí thành công!", {
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
          router.push("/signin");
        } else {
          toast.error("Đăng kí thất bại!", {
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
      } catch (error) {
        toast.error("Tài khoản đã tồn tại!", {
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
    }
  };

  return (
    <>
      <Breadcrumb title={"Signup"} pages={["Signup"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Tạo tài khoản mới
              </h2>
              <p>Nhập thông tin của bạn</p>
            </div>

            <div className="mt-5.5">
              <form onSubmit={handleSubmit}>
                {/* Tên */}
                <div className="mb-5">
                  <label htmlFor="fullName" className="block mb-2.5">
                    Tên tài khoản <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    placeholder="Tên người dùng của bạn"
                    value={form.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1 text-red">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2.5">
                    Email <span className="text-red">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Nhập email của bạn"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1 text-red">{errors.email}</p>}
                </div>

                {/* Mật khẩu */}
                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5">
                    Mật khẩu <span className="text-red">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Nhập mật khẩu của bạn"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="on"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1 text-red">{errors.password}</p>}
                </div>

                {/* Nhập lại mật khẩu */}
                <div className="mb-5.5">
                  <label htmlFor="confirmPassword" className="block mb-2.5">
                    Nhập lại mật khẩu <span className="text-red">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Nhập lại mật khẩu của bạn"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="on"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 text-red">{errors.confirmPassword}</p>}
                </div>

                {/* Số điện thoại */}
                <div className="mb-5">
                  <label htmlFor="phone" className="block mb-2.5">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    placeholder="Nhập số điện thoại của bạn"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1 text-red">{errors.phone}</p>}
                </div>

                {/* Địa chỉ */}
                <div className="mb-5">
                  <label htmlFor="address" className="block mb-2.5">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Nhập địa chỉ của bạn"
                    value={form.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1 text-red">{errors.address}</p>}
                </div>

                {/* Giới tính */}
                <div className="mb-5">
                  <span className="block mb-2.5">Giới tính <span className="text-red">*</span></span>
                  <div className="flex gap-6">
                    {[0, 1].map(g => (
                      <label key={g} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={form.gender === g}
                          onChange={handleGenderChange}
                          className="accent-blue"
                        />
                        {g === 0 ? "Nam" : "Nữ"}
                      </label>
                    ))}
                  </div>
                  {errors.gender && <p className="text-red-500 text-sm mt-1 text-red">{errors.gender}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5"
                >
                  Đăng ký
                </button>

                <p className="text-center mt-6">
                  Bạn đã có tài khoản ?
                  <Link
                    href="/signin"
                    className="text-dark ease-out duration-200 hover:text-blue pl-2"
                  >
                    Đăng nhập
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
