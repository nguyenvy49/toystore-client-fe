"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CategoryDropdown from "./CategoryDropdown";
import PriceDropdown from "./PriceDropdown";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import { useSearchParams } from "next/navigation";
import { ProductService } from "@/services/productServices";
import Image from "next/image";
import { categoryService } from "@/services/category";
import CustomSelect from "./CustomSelect";

const ShopWithSidebar = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [productStyle, setProductStyle] = useState('grid');
  const [productSidebar, setProductSidebar] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [pageSize] = useState(15);
  const [sort, setSort] = useState('CreateOn');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ from: 0, to: 5000000 });
  const [categories, setCategories] = useState([]);

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    priceRange.from > 0 ||
    priceRange.to < 5000000 ||
    sort !== 'CreateOn';

  const options = [
    { label: 'Sản phẩm mới nhất', value: 'CreateOn' },
    { label: 'Sản phẩm bán chạy nhất', value: 'BestSelling' },
    { label: 'Giá tăng dần', value: 'PriceAsc' },
    { label: 'Giá giảm dần', value: 'PriceDesc' },
    { label: 'Tất cả', value: '' },
  ];
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ from: 0, to: 5000000 });
    setSort('CreateOn');
    setCurrentPage(1);
  };
  const handleRemoveCategory = categoryId => {
    setSelectedCategories(prev => prev.filter(id => id !== categoryId));
    setCurrentPage(1);
  };
  const handleRemovePriceFilter = () => {
    setPriceRange({ from: 0, to: 5000000 });
    setCurrentPage(1);
  };
  const handleRemoveSortFilter = () => {
    setSort('CreateOn');
    setCurrentPage(1);
  };
  const handlePageChange = page => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  // Get category name by id
  const getCategoryName = categoryId => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.categoryName : '';
  };
  // Get sort label
  const getSortLabel = sortValue => {
    const option = options.find(opt => opt.value === sortValue);
    return option ? option.label : '';
  };
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };
  const handleSortChange = value => {
    setSort(value);
    setCurrentPage(1); // Reset về trang đầu khi thay đổi sắp xếp
  };

  const handleCategoryChange = categories => {
    setSelectedCategories(categories);
    setCurrentPage(1); // Reset về trang đầu khi thay đổi category
  };
  // Tạo danh sách trang cho phân trang
  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages === 0) return pages;

    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxPagesToShow / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Thêm trang đầu và dấu ... nếu cần
    if (startPage > 1) {
      pages.push(
        <li key={1}>
          <button
            onClick={() => handlePageChange(1)}
            className="flex py-1.5 px-3.5 duration-200 rounded-[3px] hover:text-white hover:bg-blue"
          >
            1
          </button>
        </li>
      );
      if (startPage > 2) {
        pages.push(
          <li key="ellipsis-start">
            <span className="flex py-1.5 px-3.5">...</span>
          </li>
        );
      }
    }

    // Thêm các trang ở giữa
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i}>
          <button
            onClick={() => handlePageChange(i)}
            className={`flex py-1.5 px-3.5 duration-200 rounded-[3px] ${i === currentPage
              ? 'bg-blue text-white'
              : 'hover:text-white hover:bg-blue'
              }`}
          >
            {i}
          </button>
        </li>
      );
    }

    // Thêm dấu ... và trang cuối nếu cần
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <li key="ellipsis-end">
            <span className="flex py-1.5 px-3.5">...</span>
          </li>
        );
      }
      pages.push(
        <li key={totalPages}>
          <button
            onClick={() => handlePageChange(totalPages)}
            className="flex py-1.5 px-3.5 duration-200 rounded-[3px] hover:text-white hover:bg-blue"
          >
            {totalPages}
          </button>
        </li>
      );
    }

    return pages;
  };

  const handlePriceChange = price => {
    setPriceRange(price);
    setCurrentPage(1); // Reset về trang đầu khi thay đổi giá
  };


  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);

    // closing sidebar while clicking outside
    function handleClickOutside(event) {
      if (!event.target.closest(".sidebar-content")) {
        setProductSidebar(false);
      }
    }

    if (productSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
  // Set category từ URL parameter
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, [categoryParam]);
  //lấy danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();

        // Pagination
        params.append('PageNumber', currentPage.toString());
        params.append('PageSize', pageSize.toString());

        // Sort
        if (sort) {
          params.append('SortBy', sort);       // dùng trực tiếp chuỗi 'CreateOn'
          params.append('SortAsc', 'true');    // hoặc 'false' nếu muốn giảm dần
        }
        console.log("Danh mục:"+selectedCategories)
        // Category filter
        selectedCategories.forEach(catId => params.append('CategoryIds', catId));

        // Price filter
        if (priceRange.from > 0) params.append('MinPrice', priceRange.from.toString());
        if (priceRange.to < 5000000) params.append('MaxPrice', priceRange.to.toString());

        // Tạo URL
        const queryString = params.toString();
        const response = await ProductService.getProduct('/api/Product/client?' + queryString);

        console.log('/api/Product/client?' + queryString)
        console.log(response)
        if (response.success) {
          setProducts(response.result.items);
          setTotalPages(response.result.totalPages);
          setCurrentPage(response.result.currentPage);
          setTotalPages(response.result.totalPages);
          setTotalCount(response.result.totalCount);
          setHasPrevious(response.result.hasPrevious);
          setHasNext(response.result.hasNext);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getListCategory('/api/Category/Client?pageSize=10000');
        if (response.success) {
          setCategories(response.result.items);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories()
  }, [currentPage, sort, pageSize, selectedCategories, priceRange])

  if (loading) {
    return (
      <>
        <Breadcrumb title={'Tất cả sản phẩm'} pages={['sản phẩm']} />
        <section className="overflow-hidden relative pb-20 pt-5 lg:pt-10 xl:pt-15 bg-[#f3f4f6] min-h-screen">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="flex items-center justify-center min-h-[600px]">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue border-t-transparent border-solid rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">
                  Đang tải sản phẩm...
                </p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Breadcrumb title={'Tất cả sản phẩm'} pages={['sản phẩm']} />
        <section className="overflow-hidden relative pb-20 pt-5 lg:pt-10 xl:pt-15 bg-[#f3f4f6] min-h-screen">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="flex items-center justify-center min-h-[600px]">
              <div className="text-center">
                <p className="text-red-500 text-lg mb-4">
                  Lỗi: {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-blue text-white rounded-md hover:bg-blue/90 transition-colors"
                >
                  Tải lại trang
                </button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title={'Tất cả sản phẩm'} pages={['sản phẩm']} />
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            {/* <!-- Sidebar Start --> */}
            <div
              className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${productSidebar
                ? "translate-x-0 bg-white p-5 h-screen overflow-y-auto"
                : "-translate-x-full"
                }`}
            >
              <button
                onClick={() => setProductSidebar(!productSidebar)}
                aria-label="button for product sidebar toggle"
                className={`xl:hidden absolute -right-12.5 sm:-right-8 flex items-center justify-center w-8 h-8 rounded-md bg-white shadow-1 ${stickyMenu
                  ? "lg:top-20 sm:top-34.5 top-35"
                  : "lg:top-24 sm:top-39 top-37"
                  }`}
              >
                <svg
                  className="fill-current"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.0068 3.44714C10.3121 3.72703 10.3328 4.20146 10.0529 4.5068L5.70494 9.25H20C20.4142 9.25 20.75 9.58579 20.75 10C20.75 10.4142 20.4142 10.75 20 10.75H4.00002C3.70259 10.75 3.43327 10.5742 3.3135 10.302C3.19374 10.0298 3.24617 9.71246 3.44715 9.49321L8.94715 3.49321C9.22704 3.18787 9.70147 3.16724 10.0068 3.44714Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.6865 13.698C20.5668 13.4258 20.2974 13.25 20 13.25L4.00001 13.25C3.5858 13.25 3.25001 13.5858 3.25001 14C3.25001 14.4142 3.5858 14.75 4.00001 14.75L18.2951 14.75L13.9472 19.4932C13.6673 19.7985 13.6879 20.273 13.9932 20.5529C14.2986 20.8328 14.773 20.8121 15.0529 20.5068L20.5529 14.5068C20.7539 14.2876 20.8063 13.9703 20.6865 13.698Z"
                    fill=""
                  />
                </svg>
              </button>

              <form onSubmit={e => e.preventDefault()}>
                <div className="flex flex-col gap-6">
                  <div className="bg-white shadow-1 rounded-lg py-4 px-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-medium text-dark">
                        Bộ lọc:
                      </p>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={handleClearFilters}
                          className="text-blue text-sm hover:underline"
                        >
                          Xóa tất cả
                        </button>
                      )}
                    </div>

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {/* Category Filters */}
                        {selectedCategories.map(
                          categoryId => (
                            <div
                              key={categoryId}
                              className="inline-flex items-center gap-1.5 bg-blue/10 text-blue text-xs px-3 py-1.5 rounded-full"
                            >
                              <span>
                                {getCategoryName(
                                  categoryId
                                )}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveCategory(
                                    categoryId
                                  )
                                }
                                className="hover:text-blue/80"
                              >
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            </div>
                          )
                        )}

                        {/* Price Filter */}
                        {(priceRange.from > 0 ||
                          priceRange.to <
                          5000000) && (
                            <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs px-3 py-1.5 rounded-full">
                              <span>
                                {new Intl.NumberFormat(
                                  'vi-VN'
                                ).format(
                                  priceRange.from
                                )}{' '}
                                -{' '}
                                {new Intl.NumberFormat(
                                  'vi-VN'
                                ).format(
                                  priceRange.to
                                )}{' '}
                                d
                              </span>
                              <button
                                type="button"
                                onClick={
                                  handleRemovePriceFilter
                                }
                                className="hover:text-green-600"
                              >
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            </div>
                          )}

                        {/* Sort Filter */}
                        {sort !== 'CreateOn' && (
                          <div className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 text-xs px-3 py-1.5 rounded-full">
                            <span>
                              {getSortLabel(sort)}
                            </span>
                            <button
                              type="button"
                              onClick={
                                handleRemoveSortFilter
                              }
                              className="hover:text-purple-600"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <CategoryDropdown
                    selectedCategories={selectedCategories}
                    onCategoryChange={handleCategoryChange}
                  />
                  <PriceDropdown
                    priceRange={priceRange}
                    onPriceChange={handlePriceChange}
                  />
                </div>
              </form>
            </div>
            {/* // <!-- Sidebar End --> */}

            {/* Content Start */}
            <div className="xl:max-w-[870px] w-full">
              <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-4">
                    <CustomSelect
                      options={options}
                      value={sort}
                      onChange={handleSortChange}
                    />
                    <p>
                      Hiển thị{' '}
                      <span className="text-dark">
                        {(currentPage - 1) * pageSize +
                          1}
                        -
                        {Math.min(
                          currentPage * pageSize,
                          totalCount
                        )}{' '}
                        / {totalCount}
                      </span>{' '}
                      Sản phẩm
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() =>
                        setProductStyle('grid')
                      }
                      aria-label="button for product grid tab"
                      className={`${productStyle === 'grid'
                        ? 'bg-blue border-blue text-white'
                        : 'text-dark bg-gray-1 border-gray-3'
                        } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                    >
                      <Image
                        src="/images/svg/grid-icon.svg"
                        alt="Grid View Icon"
                        width={18}
                        height={18}
                        className="w-4.5 h-4.5"
                      />
                    </button>
                    <button
                      onClick={() =>
                        setProductStyle('list')
                      }
                      aria-label="button for product list tab"
                      className={`${productStyle === 'list'
                        ? 'bg-blue border-blue text-white'
                        : 'text-dark bg-gray-1 border-gray-3'
                        } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                    >
                      <Image
                        src="/images/svg/list-icon.svg"
                        alt="List View Icon"
                        width={18}
                        height={18}
                        className="w-4.5 h-4.5"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid Tab Content Start */}
              {products.length > 0 ? (
                <div
                  className={`${productStyle === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-9'
                    : 'flex flex-col gap-7.5'
                    }`}
                >
                  {products.map((item, key) =>
                    productStyle === 'grid' ? (
                      <SingleGridItem
                        item={item}
                        key={key}
                      />
                    ) : (
                      <SingleListItem
                        item={item}
                        key={key}
                      />
                    )
                  )}
                </div>
              ) : (
                <div className="bg-white shadow-1 rounded-lg p-10 text-center">
                  <p className="text-gray-500 text-lg">
                    Không tìm thấy sản phẩm nào
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="mt-4 px-6 py-2 bg-blue text-white rounded-md hover:bg-blue/90 transition-colors"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              )}
              {/* Products Grid Tab Content End */}

              {/* Products Pagination Start */}
              {totalPages > 0 && (
                <div className="flex justify-center mt-15">
                  <div className="bg-white shadow-1 rounded-md p-2">
                    <ul className="flex items-center gap-1">
                      <li>
                        <button
                          onClick={() =>
                            handlePageChange(
                              currentPage - 1
                            )
                          }
                          aria-label="button for pagination left"
                          type="button"
                          disabled={!hasPrevious}
                          className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] hover:text-white hover:bg-blue disabled:text-gray-4 disabled:cursor-not-allowed"
                        >
                          <Image
                            src="/images/svg/pagination-left.svg"
                            alt="Previous Page"
                            width={18}
                            height={18}
                            className="w-4.5 h-4.5"
                          />
                        </button>
                      </li>

                      {renderPagination()}

                      <li>
                        <button
                          onClick={() =>
                            handlePageChange(
                              currentPage + 1
                            )
                          }
                          aria-label="button for pagination right"
                          type="button"
                          disabled={!hasNext}
                          className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] hover:text-white hover:bg-blue disabled:text-gray-4 disabled:cursor-not-allowed"
                        >
                          <Image
                            src="/images/svg/pagination-right.svg"
                            alt="Next Page"
                            width={18}
                            height={18}
                            className="w-4.5 h-4.5"
                          />
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              {/* Products Pagination End */}
            </div>
            {/* Content End */}
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithSidebar;