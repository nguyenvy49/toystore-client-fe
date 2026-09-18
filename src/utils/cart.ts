import { CartService } from '@/services/CartServices';
import { toast, Slide } from 'react-toastify';

export const addCart = async (productId: string, quantity: number) => {
    try {
        const res = await CartService.addCart({ productId, quantity })
        console.log(res)
        if (res.success) {
            toast.success("Thêm sản phẩm vào giỏ hàng thành công!", {
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
        } else {
            toast.error("Thêm sản phẩm vào giỏ hàng thất bại!", {
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
        toast.error("Thêm sản phẩm vào giỏ hàng thất bại!", {
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

export const updateCart = async (productId: string, quantity: number) => {
    try {
        const res = await CartService.updateCart({ productId, quantity })
        console.log(res)
        if (res.success) {
            toast.success("Cập nhật sản phẩm trong giỏ hàng thành công!", {
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
        } else {
            toast.error("Cập nhật sản phẩm trong giỏ hàng thất bại!", {
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
        toast.error("Cập nhật sản phẩm trong giỏ hàng thất bại!", {
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

export const deleteCart = async (productId: string) => {
    try {
        const res = await CartService.deleteCart(productId)
        console.log(res)
        if (res.success) {
            toast.success("Xóa sản phẩm trong giỏ hàng thành công!", {
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
        } else {
            toast.error("Xóa sản phẩm trong giỏ hàng thất bại!", {
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
        toast.error("Xóa sản phẩm trong giỏ hàng thất bại!", {
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