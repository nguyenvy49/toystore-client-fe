'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Breadcrumb from '../Common/Breadcrumb';
import Image from 'next/image';
import RecentlyViewdItems from './RecentlyViewd';
import { usePreviewSlider } from '@/app/context/PreviewSliderContext';
import { ProductService } from '@/services/productServices';
import { addCart } from '@/utils/cart';
import { formatCurrency } from '@/utils/format';

function ShoppingBagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function ZoomIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function CheckShieldIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

const ShopDetails = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const productId = searchParams.get('id');

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { openPreviewModal } = usePreviewSlider();
  const [previewImg, setPreviewImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingCart, setAddingCart] = useState(false);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        if (!productId && !slug) {
          throw new Error('Không tìm thấy thông tin sản phẩm');
        }

        const key = productId || slug;
        const response = await ProductService.getProduct(`/api/Product/${key}`);
        if (response.success) {
          setProduct(response.result);
        } else {
          throw new Error('Không tìm thấy sản phẩm');
        }
      } catch (err: any) {
        setError(err.message || 'Lỗi khi tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    if (productId || slug) {
      fetchProductDetail();
    }
  }, [productId, slug]);

  const handlePreviewSlider = () => {
    const imagesList = Array.isArray(product?.image) && product.image.length > 0
      ? product.image
      : [product?.image || '/images/noImage/error.png'];
    openPreviewModal(imagesList, previewImg);
  };

  const handleAddToCart = async () => {
    if (!product || product.quantity <= 0) return;
    try {
      setAddingCart(true);
      await addCart(product.id, quantity);
    } catch (err) {
      console.error(err);
    } finally {
      setAddingCart(false);
    }
  };

  const getDiscountedPrice = () => {
    if (!product || !product.promotion) return product?.price || 0;
    const discount = product.promotion.discountPercent || 0;
    return product.price * (1 - discount / 100);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <>
        <Breadcrumb title={'Chi tiết sản phẩm'} pages={['sản phẩm', 'chi tiết']} />
        <div className="overflow-hidden py-24 bg-slate-50 flex justify-center items-center min-h-[450px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent border-solid rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-medium text-slate-600">Đang tải thông tin sản phẩm...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Breadcrumb title={'Chi tiết sản phẩm'} pages={['sản phẩm', 'chi tiết']} />
        <div className="overflow-hidden py-20 bg-slate-50">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 text-center">
            <div className="p-8 max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-rose-600 font-semibold text-sm mb-3">
                {error || 'Không tìm thấy sản phẩm yêu cầu'}
              </p>
              <a
                href="/shop-with-sidebar"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-indigo-600 transition-colors"
              >
                Quay lại cửa hàng
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  const discountedPrice = getDiscountedPrice();
  const hasDiscount = product.promotion && product.promotion.discountPercent > 0;

  return (
    <>
      <Breadcrumb
        title={product.productName}
        pages={['sản phẩm', product.productName]}
      />

      <section className="overflow-hidden relative pb-20 pt-6 lg:pt-12">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-14 items-start">
            
            {/* Left Column: Product Image Preview */}
            <div className="lg:max-w-[540px] w-full">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 relative flex items-center justify-center group overflow-hidden">
                <button
                  onClick={handlePreviewSlider}
                  aria-label="Zoom Image"
                  className="w-10 h-10 rounded-2xl bg-white/90 border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-indigo-600 hover:bg-white transition-all absolute top-4 right-4 z-20 backdrop-blur-sm"
                  title="Phóng to ảnh"
                >
                  <ZoomIcon className="w-5 h-5" />
                </button>

                <div onClick={handlePreviewSlider} className="w-full h-[360px] sm:h-[440px] relative flex items-center justify-center cursor-zoom-in">
                  <Image
                    src={
                      (product.image && product.image[previewImg]) ||
                      '/images/noImage/error.png'
                    }
                    alt={product.productName}
                    width={440}
                    height={440}
                    className="object-contain max-h-full transition-all duration-300 group-hover:scale-105"
                    priority
                  />
                </div>
              </div>

              {/* Thumbnails list */}
              {product.image && product.image.length > 1 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {product.image.map((imgUrl: string, key: number) => (
                    <button
                      onClick={() => setPreviewImg(key)}
                      key={key}
                      className={`flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white border-2 transition-all p-1 ${
                        key === previewImg
                          ? 'border-indigo-600 shadow-md scale-105'
                          : 'border-slate-200 opacity-75 hover:opacity-100 hover:border-slate-300'
                      }`}
                    >
                      <Image
                        width={64}
                        height={64}
                        src={imgUrl}
                        alt={`thumb-${key}`}
                        className="object-contain h-full w-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Info & Purchase Actions */}
            <div className="flex-1 w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
              
              {/* Product Category & Status Pill */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  <CheckShieldIcon className="w-3.5 h-3.5 text-indigo-600" />
                  {product.category?.categoryName || product.category?.parentName || 'Chính hãng ToysWorld'}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                    product.quantity > 0
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      product.quantity > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                    }`}
                  ></span>
                  {product.quantity > 0 ? `Còn hàng (${product.quantity})` : 'Hết hàng'}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="font-extrabold text-2xl sm:text-3xl text-slate-900 leading-tight mb-4">
                {product.productName}
              </h1>

              {/* Price Container */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6 flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-extrabold text-rose-600 tracking-tight">
                  {formatCurrency(discountedPrice)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-sm font-semibold text-slate-400 line-through">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-600 text-white">
                      Giảm {product.promotion.discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Metadata details */}
              <div className="space-y-3 py-4 border-y border-slate-100 text-xs sm:text-sm text-slate-700 mb-6">
                {product.supplier && (
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-slate-500 min-w-[110px]">Thương hiệu:</span>
                    <span className="font-bold text-slate-900">{product.supplier.name}</span>
                  </div>
                )}
                {product.promotion && product.promotion.endDate && (
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-slate-500 min-w-[110px]">Khuyến mãi đến:</span>
                    <span className="font-bold text-amber-600">{formatDate(product.promotion.endDate)}</span>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-slate-500 min-w-[110px]">Cam kết:</span>
                  <span className="text-slate-600">Đổi trả 7 ngày • An toàn 100% cho trẻ nhỏ</span>
                </div>
              </div>

              {/* Quantity & Add to Cart Form */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-xl bg-white text-slate-700 hover:text-indigo-600 hover:shadow-sm flex items-center justify-center font-bold transition-all disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-extrabold text-sm text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => quantity < product.quantity && setQuantity(quantity + 1)}
                    disabled={quantity >= product.quantity}
                    className="w-10 h-10 rounded-xl bg-white text-slate-700 hover:text-indigo-600 hover:shadow-sm flex items-center justify-center font-bold transition-all disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.quantity <= 0 || addingCart}
                  className={`flex-1 min-w-[200px] h-12 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                    product.quantity > 0
                      ? 'bg-slate-900 hover:bg-indigo-600'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  }`}
                >
                  <ShoppingBagIcon className="w-4 h-4 text-white" />
                  <span>{addingCart ? 'Đang thêm vào giỏ...' : 'Thêm Vào Giỏ Hàng'}</span>
                </button>
              </div>

            </div>
          </div>

          {/* Description Card */}
          <div className="mt-12 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h2 className="font-extrabold text-xl text-slate-900 tracking-tight">
                Mô Tả Sản Phẩm
              </h2>
            </div>
            <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
              <div dangerouslySetInnerHTML={{ __html: product.description || 'Chưa có thông tin mô tả chi tiết cho sản phẩm này.' }} />
            </div>
          </div>

        </div>
      </section>

      {/* Recently Viewed */}
      <RecentlyViewdItems categoryId={product?.category?.id || product?.id} />
    </>
  );
};

export default ShopDetails;
