'use client';

import { useState, useEffect } from 'react';
import { categoryService } from '@/services/category';

function CategoryTagIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="3" />
    </svg>
  );
}

function ChevronDownIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

const CategoryItem = ({ category, isSelected, onToggle }: { category: any; isSelected: boolean; onToggle: (id: string) => void }) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(category.id)}
      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
        isSelected
          ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/60'
          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`flex items-center justify-center rounded-lg w-4 h-4 border transition-colors ${
            isSelected
              ? 'border-indigo-600 bg-indigo-600 text-white'
              : 'bg-white border-slate-300'
          }`}
        >
          {isSelected && (
            <svg
              className="w-3 h-3 text-white"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="2.5 6 5 8.5 9.5 3.5" />
            </svg>
          )}
        </div>

        <span className="line-clamp-1">{category.categoryName}</span>
      </div>
    </button>
  );
};

const CategoryDropdown = ({ selectedCategories, onCategoryChange }: { selectedCategories: string[]; onCategoryChange: (cats: string[]) => void }) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryService.getListCategory('/api/Category/Client?pageSize=100');
        if (response.success) {
          const parentCategories = response.result.items.filter(
            (cat: any) => cat.parentId === null
          );
          setCategories(parentCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleToggle = (categoryId: string) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    onCategoryChange(newSelected);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      {/* Header */}
      <div
        onClick={(e) => {
          e.preventDefault();
          setToggleDropdown(!toggleDropdown);
        }}
        className="cursor-pointer flex items-center justify-between p-4 bg-slate-50 border-b border-slate-100 transition-colors hover:bg-slate-100/80"
      >
        <div className="flex items-center gap-2">
          <CategoryTagIcon className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-sm text-slate-900 tracking-wide">
            Danh Mục Sản Phẩm
          </h3>
        </div>

        <button
          type="button"
          aria-label="Toggle category dropdown"
          className={`text-slate-500 transition-transform duration-200 ${
            toggleDropdown ? 'rotate-180' : ''
          }`}
        >
          <ChevronDownIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Body List */}
      {toggleDropdown && (
        <div
          className="p-3 flex flex-col gap-1.5 max-h-[360px] overflow-y-auto no-scrollbar"
        >
          {loading ? (
            <div className="p-3 text-center text-xs text-slate-400 animate-pulse">
              Đang tải danh mục...
            </div>
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                isSelected={selectedCategories.includes(category.id)}
                onToggle={handleToggle}
              />
            ))
          ) : (
            <p className="p-3 text-center text-xs text-slate-400">
              Không tìm thấy danh mục nào.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
