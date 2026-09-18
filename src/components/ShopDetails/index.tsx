'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Breadcrumb from '../Common/Breadcrumb';
import Image from 'next/image';
import Newsletter from '../Common/Newsletter';
import RecentlyViewdItems from './RecentlyViewd';
import { usePreviewSlider } from '@/app/context/PreviewSliderContext';
import { ProductService } from '@/services/productServices';
import { addCart } from '@/utils/cart';

const ShopDetails = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const productId = searchParams.get('id');

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { openPreviewModal } = usePreviewSlider();
  const [previewImg, setPreviewImg] = useState(0);

  const [quantity, setQuantity] = useState(1);
  // Fetch product detail from API
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);

        if (!productId && !slug) {
          throw new Error('Không tìm thấy thông tin sản phẩm');
        }

        const key = productId || slug;
        const response = await ProductService.getProduct(`/api/Product/${key}`);
        console.log('Product detail response:', response);
        if (response.success) {
          setProduct(response.result);
        } else {
          throw new Error('Không tìm thấy sản phẩm');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId || slug) {
      fetchProductDetail();
    }
  }, [productId, slug]);

  // pass the product here when you get the real data.
  const handlePreviewSlider = () => {
    openPreviewModal();
  };
  const handleAddToCart = async () => {
    await addCart(product.id, 1)
  };
  // Format giá
  const formatPrice = (price: number) => {
    return price?.toLocaleString('vi-VN') + ' đ' || '0 đ';
  };

  // Tính giá sau khuyến mãi
  const getDiscountedPrice = () => {
    if (!product || !product.promotion) return product?.price || 0;
    const discount = product.promotion.discountPercent || 0;
    return product.price * (1 - discount / 100);
  };

  // Format date
  const formatDate = (dateString: string) => {
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
        <Breadcrumb
          title={'Chi tiết sản phẩm'}
          pages={['sản phẩm', 'chi tiết']}
        />
        <div className="overflow-hidden py-20 bg-gray-2 flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue border-t-transparent border-solid rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải sản phẩm...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Breadcrumb
          title={'Chi tiết sản phẩm'}
          pages={['sản phẩm', 'chi tiết']}
        />
        <div className="overflow-hidden py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 text-center">
            <p className="text-red-500">
              {error || 'Không tìm thấy sản phẩm'}
            </p>
          </div>
        </div>
      </>
    );
  }

  const discountedPrice = getDiscountedPrice();

  return (
    <>
      <Breadcrumb
        title={product.productName}
        pages={['sản phẩm /', product.productName]}
      />

      <>
        <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-17.5">
              <div className="lg:max-w-[570px] w-full">
                <div className="lg:min-h-[512px] rounded-lg shadow-1 bg-gray-2 p-4 sm:p-7.5 relative flex items-center justify-center">
                  <div>
                    <button
                      onClick={handlePreviewSlider}
                      aria-label="button for zoom"
                      className="gallery__Image w-11 h-11 rounded-[5px] bg-gray-1 shadow-1 flex items-center justify-center ease-out duration-200 text-dark hover:text-blue absolute top-4 lg:top-6 right-4 lg:right-6 z-50"
                    >
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.11493 1.14581L9.16665 1.14581C9.54634 1.14581 9.85415 1.45362 9.85415 1.83331C9.85415 2.21301 9.54634 2.52081 9.16665 2.52081C7.41873 2.52081 6.17695 2.52227 5.23492 2.64893C4.31268 2.77292 3.78133 3.00545 3.39339 3.39339C3.00545 3.78133 2.77292 4.31268 2.64893 5.23492C2.52227 6.17695 2.52081 7.41873 2.52081 9.16665C2.52081 9.54634 2.21301 9.85415 1.83331 9.85415C1.45362 9.85415 1.14581 9.54634 1.14581 9.16665L1.14581 9.11493C1.1458 7.43032 1.14579 6.09599 1.28619 5.05171C1.43068 3.97699 1.73512 3.10712 2.42112 2.42112C3.10712 1.73512 3.97699 1.43068 5.05171 1.28619C6.09599 1.14579 7.43032 1.1458 9.11493 1.14581ZM16.765 2.64893C15.823 2.52227 14.5812 2.52081 12.8333 2.52081C12.4536 2.52081 12.1458 2.21301 12.1458 1.83331C12.1458 1.45362 12.4536 1.14581 12.8333 1.14581L12.885 1.14581C14.5696 1.1458 15.904 1.14579 16.9483 1.28619C18.023 1.43068 18.8928 1.73512 19.5788 2.42112C20.2648 3.10712 20.5693 3.97699 20.7138 5.05171C20.8542 6.09599 20.8542 7.43032 20.8541 9.11494V9.16665C20.8541 9.54634 20.5463 9.85415 20.1666 9.85415C19.787 9.85415 19.4791 9.54634 19.4791 9.16665C19.4791 7.41873 19.4777 6.17695 19.351 5.23492C19.227 4.31268 18.9945 3.78133 18.6066 3.39339C18.2186 3.00545 17.6873 2.77292 16.765 2.64893ZM1.83331 12.1458C2.21301 12.1458 2.52081 12.4536 2.52081 12.8333C2.52081 14.5812 2.52227 15.823 2.64893 16.765C2.77292 17.6873 3.00545 18.2186 3.39339 18.6066C3.78133 18.9945 4.31268 19.227 5.23492 19.351C6.17695 19.4777 7.41873 19.4791 9.16665 19.4791C9.54634 19.4791 9.85415 19.787 9.85415 20.1666C9.85415 20.5463 9.54634 20.8541 9.16665 20.8541H9.11494C7.43032 20.8542 6.09599 20.8542 5.05171 20.7138C3.97699 20.5693 3.10712 20.2648 2.42112 19.5788C1.73512 18.8928 1.43068 18.023 1.28619 16.9483C1.14579 15.904 1.1458 14.5696 1.14581 12.885L1.14581 12.8333C1.14581 12.4536 1.45362 12.1458 1.83331 12.1458ZM20.1666 12.1458C20.5463 12.1458 20.8541 12.4536 20.8541 12.8333V12.885C20.8542 14.5696 20.8542 15.904 20.7138 16.9483C20.5693 18.023 20.2648 18.8928 19.5788 19.5788C18.8928 20.2648 18.023 20.5693 16.9483 20.7138C15.904 20.8542 14.5696 20.8542 12.885 20.8541H12.8333C12.4536 20.8541 12.1458 20.5463 12.1458 20.1666C12.1458 19.787 12.4536 19.4791 12.8333 19.4791C14.5812 19.4791 15.823 19.4777 16.765 19.351C17.6873 19.227 18.2186 18.9945 18.6066 18.6066C18.9945 18.2186 19.227 17.6873 19.351 16.765C19.4777 15.823 19.4791 14.5812 19.4791 12.8333C19.4791 12.4536 19.787 12.1458 20.1666 12.1458Z"
                          fill=""
                        />
                      </svg>
                    </button>

                    <Image
                      src={
                        product.image[previewImg] ||
                        '/images/noImage/error.png'
                      }
                      alt={product.productName}
                      width={400}
                      height={400}
                    />
                  </div>
                </div>

                {/* ?  &apos;border-blue &apos; :  &apos;border-transparent&apos; */}
                <div className="flex flex-wrap sm:flex-nowrap gap-4.5 mt-6">
                  {product.image?.map((item, key) => (
                    <button
                      onClick={() => setPreviewImg(key)}
                      key={key}
                      className={`flex items-center justify-center w-15 sm:w-25 h-15 sm:h-25 overflow-hidden rounded-lg bg-gray-2 shadow-1 ease-out duration-200 border-2 hover:border-blue ${key === previewImg
                        ? 'border-blue'
                        : 'border-transparent'
                        }`}
                    >
                      <Image
                        width={50}
                        height={50}
                        src={item}
                        alt="thumbnail"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* <!-- product content --> */}
              <div className="max-w-[539px] w-full">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-xl sm:text-2xl xl:text-custom-3 text-dark capitalize">
                    {product.productName}
                  </h2>

                  {product.promotion && (
                    <div className="inline-flex font-medium text-custom-sm text-white bg-blue rounded py-0.5 px-2.5">
                      -{product.promotion.discountPercent}
                      %
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-5.5 mb-4.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-semibold ${product.quantity > 0 ? 'text-green' : 'text-red'}`}>
                      {product.quantity > 0
                        ? 'Còn hàng'
                        : 'Hết hàng'}
                    </span>
                  </div>
                </div>

                <h3 className="font-medium text-custom-1 mb-4.5">
                  <span className="text-sm sm:text-base text-dark">
                    Giá: {formatPrice(discountedPrice)}
                  </span>
                  {product.promotion && (
                    <span className="line-through ml-2">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </h3>

                {/* Product Info */}
                <div className="flex flex-col gap-3 border-y border-gray-3 mt-7.5 mb-6 py-6">
                  {/* Category */}
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-dark min-w-[100px]">
                      Danh mục:
                    </span>
                    <span className="text-gray-600">
                      {product.category?.parentName &&
                        product.category?.childName
                        ? `${product.category.parentName} > ${product.category.childName}`
                        : product.category
                          ?.parentName ||
                        product.category?.childName ||
                        'Chưa phân loại'}
                    </span>
                  </div>

                  {/* Supplier */}
                  {product.supplier && (
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-dark min-w-[100px]">
                        Nhà cung cấp:
                      </span>
                      <span className="text-gray-600">
                        {product.supplier.name}
                      </span>
                    </div>
                  )}

                  {/* Promotion End Date */}
                  {product.promotion && (
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-dark min-w-[100px]">
                        KM hết hạn:
                      </span>
                      <span className="text-red-500 font-medium">
                        {formatDate(
                          product.promotion.endDate
                        )}
                      </span>
                    </div>
                  )}

                  {/* Stock Quantity */}
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-dark min-w-[100px]">
                      Còn lại:
                    </span>
                    <span
                      className={`font-semibold ${product.quantity > 10
                        ? 'text-green'
                        : product.quantity > 0
                          ? 'text-orange'
                          : 'text-red-500'
                        }`}
                    >
                      {product.quantity} sản phẩm
                    </span>
                  </div>
                </div>

                <form onSubmit={e => e.preventDefault()}>
                  <div className="flex flex-wrap items-center gap-4.5">
                    <div className="flex items-center rounded-md border border-gray-3">
                      <button
                        aria-label="button for remove product"
                        className="flex items-center justify-center w-12 h-12 ease-out duration-200 hover:text-blue disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() =>
                          quantity > 1 &&
                          setQuantity(quantity - 1)
                        }
                        disabled={quantity <= 1}
                      >
                        <svg
                          className="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.33301 10.0001C3.33301 9.53984 3.7061 9.16675 4.16634 9.16675H15.833C16.2932 9.16675 16.6663 9.53984 16.6663 10.0001C16.6663 10.4603 16.2932 10.8334 15.833 10.8334H4.16634C3.7061 10.8334 3.33301 10.4603 3.33301 10.0001Z"
                            fill=""
                          />
                        </svg>
                      </button>

                      <span className="flex items-center justify-center w-16 h-12 border-x border-gray-4">
                        {quantity}
                      </span>

                      <button
                        onClick={() => {
                          if (
                            quantity <
                            product.quantity
                          ) {
                            setQuantity(
                              quantity + 1
                            );
                          }
                        }}
                        aria-label="button for add product"
                        className="flex items-center justify-center w-12 h-12 ease-out duration-200 hover:text-blue disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          quantity >= product.quantity
                        }
                      >
                        <svg
                          className="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.33301 10C3.33301 9.5398 3.7061 9.16671 4.16634 9.16671H15.833C16.2932 9.16671 16.6663 9.5398 16.6663 10C16.6663 10.4603 16.2932 10.8334 15.833 10.8334H4.16634C3.7061 10.8334 3.33301 10.4603 3.33301 10Z"
                            fill=""
                          />
                          <path
                            d="M9.99967 16.6667C9.53944 16.6667 9.16634 16.2936 9.16634 15.8334L9.16634 4.16671C9.16634 3.70647 9.53944 3.33337 9.99967 3.33337C10.4599 3.33337 10.833 3.70647 10.833 4.16671L10.833 15.8334C10.833 16.2936 10.4599 16.6667 9.99967 16.6667Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={product.quantity <= 0}
                      className={`inline-flex font-medium text-white py-3 px-7 rounded-md ease-out duration-200 
                      ${product.quantity > 0
                          ? 'bg-blue hover:bg-blue-dark'
                          : 'bg-meta-5 cursor-not-allowed'
                        }`}
                    >
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="mt-12">
              <div className="flex gap-4 border-b border-gray-3">
                <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
                  Mô tả sản phẩm
                </h2>
              </div>

              <div className="mt-6 text-gray-700">
                <div dangerouslySetInnerHTML={{ __html: product.description || 'Chưa có mô tả' }} />
              </div>
            </div>
          </div>

        </section>

        <RecentlyViewdItems
          categoryId={product?.category?.id || product?.id}
        />
      </>
    </>
  );
};

export default ShopDetails;
