import {
    HiChartPie,
    HiUser,
    HiUsers,
    HiUserGroup,
    HiViewList,
} from "react-icons/hi";

export default [
    {
        name: "Dashboard",
        show: true,
        icon: HiChartPie,
        route: route("dashboard"),
        active: "dashboard",
        permission: "view-dashboard",
    },
    {
        name: "Kategori",
        show: true,
        icon: HiViewList,
        route: route("category.index"),
        active: "category.*",
        permission: "view-category",
    },
    {
        name: "User",
        show: true,
        icon: HiUser,
        items: [
            {
                name: "Roles",
                show: true,
                icon: HiUserGroup,
                route: route("roles.index"),
                active: "roles.*",
                permission: "view-role",
            },
            {
                name: "Users",
                show: true,
                icon: HiUsers,
                route: route("user.index"),
                active: "user.index",
                permission: "view-user",
            },
        ],
    },
];
