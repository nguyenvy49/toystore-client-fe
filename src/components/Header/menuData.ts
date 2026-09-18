type Menu = {
  id: number;
  title: string;
  path?: string;
  newTab: boolean;
  submenu?: Menu[];
};


export const menuData: Menu[] = [
  {
    id: 1,
    title: 'Trang chủ',
    newTab: false,
    path: '/',
  },
  {
    id: 2,
    title: 'Sản phẩm',
    newTab: false,
    path: '/shop-with-sidebar',
  },
  {
    id: 6,
    title: 'pages',
    newTab: false,
    path: '/',
    submenu: [
      {
        id: 61,
        title: 'Sản phẩm',
        newTab: false,
        path: '/shop-with-sidebar',
      },
      {
        id: 65,
        title: 'Giỏ hàng',
        newTab: false,
        path: '/cart',
      },
      {
        id: 67,
        title: 'Sign in',
        newTab: false,
        path: '/signin',
      },
      {
        id: 68,
        title: 'Tài khoản cá nhân',
        newTab: false,
        path: '/my-account',
      }, {
        id: 69,
        title: 'Cẩm nang',
        newTab: false,
        path: '/blogs/blog-grid-with-sidebar',
      }
    ],
  },
  {
    id: 7,
    title: 'Cẩm nang',
    newTab: false,
    path: '/blogs/blog-grid-with-sidebar',
  },
];
