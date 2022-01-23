import {
    PieChart,
    Clipboard,
    Calendar,
    BarChart2,
    Book,
    List,
    BookOpen,
    Layers,
    Tag,
    Settings,
    Anchor,
    Database,
    FilePlus,
    FileMinus,
    Minus,
    Plus,
    Users,
    Truck,
    Tool,
    DollarSign,
    BarChart,
    ShoppingCart,
    BatteryCharging,
    MessageCircle,
    ShoppingBag,
    Mail,
    Code,
    User,
    Clock,
    ChevronRight,
    Bell,
    Send,
} from 'react-feather'

// --- Dashboard ---
import DashboardIndex from '../pages/dashboard/Index'

// --- Accounting ---
import AccountingLedgerIndex from '../pages/accounting/Ledger/Index'
import AccountingLedgerShow from '../pages/accounting/Ledger/Show'
import AccountingCashIndex from '../pages/accounting/Cash/Index'
import AccountingDailySell from '../pages/accounting/DailySell/Index'
import AccountingDailyDue from '../pages/accounting/DailyDue/Index'
import AccountingDailyExpense from '../pages/accounting/DailyExpense/Index'
import AccountingDailyExpenseCreate from '../pages/accounting/DailyExpense/Store'
// import AccountingDSPPP from '../pages/accounting/DSPPP/Index'
import AccountingDailyPayable from '../pages/accounting/DailyPayable/Index'
import AccountingDailyPayableCreate from '../pages/accounting/DailyPayable/Store'

// --- Customer-Management ---
import CustomerIndex from '../pages/customer/Index'
import CustomerShow from '../pages/customer/Show'
import CustomerCreate from '../pages/customer/Create'
import CustomerEdit from '../pages/customer/Edit'

// --- Due-Management ---
import DueIndex from '../pages/dueManagement/Index'

// --- E-commerce ---
import EcomOrderIndex from '../pages/ecommerce/orders/Index'
import EcomOrderShow from '../pages/ecommerce/orders/Show'

// --- Employee-Management ---
import EmployeeList from "../pages/employeeManagement/EmployeeList"
import EmployeeCreate from '../pages/employeeManagement/EmployeeCreate'
import EmployeeEdit from '../pages/employeeManagement/EmployeeEdit'
import EmployeeAttendance from "../pages/employeeManagement/EmployeeAttendance"
import EmployeeOvertime from "../pages/employeeManagement/EmployeeOvertime"
import EmployeeSalary from "../pages/employeeManagement/EmployeeSalary"
import EmployeeAttendanceReport from "../pages/employeeManagement/EmployeeAttendanceReport"
import EmployeeAttendanceReportView from '../pages/employeeManagement/EmployeeAttendanceReportView'
import EmployeeProfileShow from '../pages/employeeManagement/EmployeeProfileShow'
import EmployeeBonus from '../pages/employeeManagement/EmployeeBonus'

// --- Inventory-Management ---

// --- Inventory-Management / Product ---
import InventoryProductIndex from '../pages/inventory/product/Index'
import InventoryProductCreate from '../pages/inventory/product/Create'
import InventoryProductUpdate from '../pages/inventory/product/Update'
import InventoryProductShow from '../pages/inventory/product/Show'
import InventoryCategoryIndex from '../pages/inventory/product/Category'
import InventoryBrandIndex from '../pages/inventory/product/Brand'

// --- Inventory-Management / Stock ---
import InventoryStockStatus from '../pages/inventory/stock/StockStatus'
import InventoryStockInHistory from '../pages/inventory/stock/StockInHistory'
import InventoryStockOutHistory from '../pages/inventory/stock/StockOutHistory'
import InventoryStockIn from '../pages/inventory/stock/StockIn'
import InventoryStockOut from '../pages/inventory/stock/StockOut'
// import InventoryStockAdd from '../pages/inventory/stock/StockAdd'

// --- Inventory-Management / Supplier ---
import InventorySupplierIndex from '../pages/inventory/supplier/Index'
import InventorySupplierAdd from '../pages/inventory/supplier/Create'
import InventorySupplierEdit from '../pages/inventory/supplier/Edit'
import InventorySupplierShow from '../pages/inventory/supplier/Show'


// --- IMEI Code-Management ---
import IMEISingleProductCode from "../pages/imei/SingleProductCode"
import IMEISeperateProductCode from "../pages/imei/SeperateProductCode"

// --- Installment-Management ---
import InstallmentIndex from '../pages/installmentManagement/Index'

// --- Mechanic & Servicing ---
// --- Mechanic
import MechanicServicingMechanicIndex from '../pages/mechanicAndServicing/mechanic/Index'
import MechanicServicingMechanicStore from '../pages/mechanicAndServicing/mechanic/Store'
import MechanicServicingMechanicEdit from '../pages/mechanicAndServicing/mechanic/Edit'
import MechanicServicingMechanicShow from '../pages/mechanicAndServicing/mechanic/Show'

// --- Servicing
import MechanicServicingServicingIndex from '../pages/mechanicAndServicing/servicing/Index'
import MechanicServicingServicingStore from '../pages/mechanicAndServicing/servicing/Store'
import MechanicServicingServicingEdit from '../pages/mechanicAndServicing/servicing/Edit'
import MechanicServicingServicingShow from '../pages/mechanicAndServicing/servicing/Show'
import MechanicServicingServicingPrint from '../pages/mechanicAndServicing/servicing/Print'


// --- POS ---
import PosPointOfSellIndex from '../pages/pos/pos/Index'
import PosOrderIndex from '../pages/pos/order/Index'
import PosOrderShow from '../pages/pos/order/Show'
// import ServicingIndex from '../pos/servicing/Index'

// --- Product return & replacement ---
import ProductReturnAndReplacement from '../pages/productReturnAndReplacement/Index'
import ProductReturnAndReplacementShow from '../pages/productReturnAndReplacement/Show'

// --- SMS ---
import SmsIndex from '../pages/sms/Index'
import SmsPackages from '../pages/sms/Packages'
import SmsSend from '../pages/sms/Send'

// --- Reports ---
import ReportCustomer from '../pages/reports/Customer'
import ReportPurchaseDue from '../pages/reports/PurchaseDue'
import ReportRevenue from '../pages/reports/Revenue'
import ReportSales from '../pages/reports/Sales'
import ReportServiceRevenue from '../pages/reports/Servicing'
import ReportStock from '../pages/reports/Stock'

// --- Notice ---
import NoticeSend from '../pages/notice/NoticeSend'
import NoticeIndex from '../pages/notice/Index'

// --- Settings ---
import SettingsIndex from '../pages/settings/Index'

// --- Static ---
import StaticTermOfServices from '../pages/termOfService/Index'
import StaticDataPolicy from '../pages/dataPolicy/Index'
import StaticCookies from '../pages/cookies/Index'
import StaticCommunityStandard from '../pages/communityStandard/Index'
import StaticAbout from '../pages/about/Index'

export const routes = [

    // Dashboard
    {
        title: "Dashboard",
        name: "dashboard",
        path: "/dashboard",
        exact: true,
        inDrawer: true,
        icon: <PieChart size={16} />,
        component: DashboardIndex
    },

    // Accounting
    {
        title: "Accounting",
        name: "accounting",
        inDrawer: true,
        icon: <Book size={16} />,
        children: [
            {
                title: "Ledger",
                name: "accounting ledger index",
                exact: true,
                inDrawer: true,
                icon: <Database size={16} />,
                path: "/dashboard/accounting/ledger",
                component: AccountingLedgerIndex
            },
            {
                title: "Ledger show",
                name: "accounting ledger show",
                exact: true,
                inDrawer: false,
                icon: null,
                path: "/dashboard/accounting/ledger/:id",
                component: AccountingLedgerShow
            },
            {
                title: "Cash",
                name: "accounting cash index",
                exact: true,
                inDrawer: true,
                icon: <DollarSign size={16} />,
                path: "/dashboard/accounting/cash",
                component: AccountingCashIndex
            },
            {
                title: "Daily Sell",
                name: "accounting daily sell",
                exact: true,
                inDrawer: true,
                icon: <BarChart size={16} />,
                path: "/dashboard/accounting/daily-sell",
                component: AccountingDailySell
            },
            {
                title: "Daily Due",
                name: "accounting daily due",
                exact: true,
                inDrawer: true,
                icon: <DollarSign size={16} />,
                path: "/dashboard/accounting/daily-due",
                component: AccountingDailyDue
            },
            {
                title: "Daily expense",
                name: "accounting daily expense",
                exact: true,
                inDrawer: true,
                icon: <BarChart2 size={16} />,
                path: "/dashboard/accounting/daily-expense",
                component: AccountingDailyExpense
            },
            {
                title: "Daily expense create",
                name: "accounting daily expense create",
                exact: true,
                inDrawer: false,
                icon: null,
                path: "/dashboard/accounting/daily-expense/create",
                component: AccountingDailyExpenseCreate
            },
            {
                title: "Daily payable",
                name: "accounting daily payable",
                exact: true,
                inDrawer: true,
                icon: <Truck size={16} />,
                path: "/dashboard/accounting/daily-payable",
                component: AccountingDailyPayable
            },
            {
                title: "Daily payable create",
                name: "accounting daily payable create",
                exact: true,
                inDrawer: false,
                icon: null,
                path: "/dashboard/accounting/daily-payable/create",
                component: AccountingDailyPayableCreate
            }
        ]
    },

    // Customer management
    {
        title: "Customer management",
        name: "customer index",
        exact: true,
        inDrawer: true,
        icon: <Users size={16} />,
        path: "/dashboard/customer",
        component: CustomerIndex
    },
    {
        title: "Customer create",
        name: "customer create",
        exact: true,
        inDrawer: false,
        icon: null,
        path: "/dashboard/customer/create",
        component: CustomerCreate
    },
    {
        title: "Customer edit",
        name: "customer edit",
        exact: true,
        inDrawer: false,
        icon: null,
        path: "/dashboard/customer/edit/:id",
        component: CustomerEdit
    },
    {
        title: "Customer show",
        name: "customer show",
        exact: true,
        inDrawer: false,
        icon: null,
        path: "/dashboard/customer/show/:id",
        component: CustomerShow
    },

    // Due management
    {
        title: "Due management",
        name: "due",
        exact: true,
        inDrawer: true,
        icon: <BookOpen size={16} />,
        path: "/dashboard/due-management",
        component: DueIndex
    },

    // E-commerce
    {
        title: "E-commerce",
        name: "ecommerce",
        exact: true,
        inDrawer: true,
        icon: <ShoppingCart size={16} />,
        path: "/dashboard/ecommerce/orders",
        component: EcomOrderIndex
    },
    {
        title: "E-commerce order show",
        name: "ecommerce order-show",
        exact: true,
        inDrawer: false,
        icon: null,
        path: "/dashboard/ecommerce/orders/:id",
        component: EcomOrderShow
    },

    // Employee management
    {
        title: "Employee management",
        name: "employee",
        inDrawer: true,
        icon: <User size={16} />,
        children: [
            {
                title: "Employee List",
                name: "employee list",
                exact: true,
                inDrawer: true,
                icon: <List size={16} />,
                path: "/dashboard/employee-management/list",
                component: EmployeeList
            },
            {
                title: "Employee Create",
                name: "employee create",
                exact: true,
                inDrawer: false,
                icon: null,
                path: "/dashboard/employee-management/create",
                component: EmployeeCreate
            },
            {
                title: "Employee Edit",
                name: "employee edit",
                exact: true,
                inDrawer: false,
                icon: null,
                path: "/dashboard/employee-management/edit/:id",
                component: EmployeeEdit
            },
            {
                title: "Employee Show",
                name: "employee show",
                exact: true,
                inDrawer: false,
                icon: null,
                path: "/dashboard/employee-management/profile-show/:id",
                component: EmployeeProfileShow
            },
            {
                title: "Employee attendance",
                name: "employee attendance",
                exact: true,
                inDrawer: true,
                icon: <Anchor size={16} />,
                path: "/dashboard/employee-management/attendance",
                component: EmployeeAttendance
            },
            {
                title: "Employee overtime",
                name: "employee overtime",
                exact: true,
                inDrawer: true,
                icon: <Clock size={16} />,
                path: "/dashboard/employee-management/overtime",
                component: EmployeeOvertime
            },
            {
                title: "Employee Bonus",
                name: "employee bonus",
                exact: true,
                inDrawer: true,
                icon: <DollarSign size={16} />,
                path: "/dashboard/employee-management/bonus",
                component: EmployeeBonus
            },
            {
                title: "Employee salary",
                name: "employee salary",
                exact: true,
                inDrawer: true,
                icon: <DollarSign size={16} />,
                path: "/dashboard/employee-management/salary",
                component: EmployeeSalary
            },
            {
                title: "Employee attendance-report",
                name: "employee attendance report",
                exact: true,
                inDrawer: true,
                icon: <BarChart2 size={16} />,
                path: "/dashboard/employee-management/attendance-report",
                component: EmployeeAttendanceReport
            },
            {
                title: "Employee attendance-report view",
                name: "employee attendance report view",
                exact: true,
                inDrawer: false,
                path: "/dashboard/employee-management/attendance-report-view/:id",
                component: EmployeeAttendanceReportView
            },

        ]
    },

    // Inventory management
    {
        title: "Inventory management",
        name: "inventory",
        inDrawer: true,
        icon: <Clipboard size={16} />,
        children: [
            {
                title: "Product",
                name: "inventory product",
                inDrawer: true,
                icon: <PieChart size={16} />,
                children: [
                    {
                        title: "Product List",
                        name: "inventory product list",
                        inDrawer: true,
                        exact: true,
                        icon: <List size={16} />,
                        path: "/dashboard/inventory/product/list",
                        component: InventoryProductIndex
                    },
                    {
                        title: "Product Edit",
                        name: "inventory product list",
                        inDrawer: false,
                        exact: true,
                        icon: null,
                        path: "/dashboard/inventory/product/edit/:id",
                        component: InventoryProductUpdate
                    },
                    {
                        title: "Product Show",
                        name: "inventory product Show",
                        inDrawer: false,
                        exact: true,
                        icon: null,
                        path: "/dashboard/inventory/product/show/:id",
                        component: InventoryProductShow
                    },
                    {
                        title: "Product Category",
                        name: "inventory product category",
                        inDrawer: true,
                        exact: true,
                        icon: <BookOpen size={16} />,
                        path: "/dashboard/inventory/product/category",
                        component: InventoryCategoryIndex
                    },
                    {
                        title: "Product Brands",
                        name: "inventory product brands",
                        inDrawer: true,
                        exact: true,
                        icon: <Layers size={16} />,
                        path: "/dashboard/inventory/product/brands",
                        component: InventoryBrandIndex
                    },
                    {
                        title: "Add New Product",
                        name: "inventory product add",
                        inDrawer: true,
                        exact: true,
                        icon: <Tag size={16} />,
                        path: "/dashboard/inventory/product/new",
                        component: InventoryProductCreate
                    }
                ]
            },
            {
                title: "Stock",
                name: "inventory stock",
                inDrawer: true,
                icon: <Anchor size={16} />,
                children: [
                    {
                        title: "Stock Status",
                        name: "inventory stock status",
                        inDrawer: true,
                        exact: true,
                        icon: <Database size={16} />,
                        path: "/dashboard/inventory/stock/status",
                        component: InventoryStockStatus
                    },
                    {
                        title: "Stock In History",
                        name: "inventory stock in-history",
                        inDrawer: true,
                        exact: true,
                        icon: < FilePlus size={16} />,
                        path: "/dashboard/inventory/stock/in-history",
                        component: InventoryStockInHistory
                    },
                    {
                        title: "Stock Out History",
                        name: "inventory stock out-history",
                        inDrawer: true,
                        exact: true,
                        icon: < FileMinus size={16} />,
                        path: "/dashboard/inventory/stock/out-history",
                        component: InventoryStockOutHistory
                    },
                    {
                        title: "Stock In",
                        name: "inventory stock in",
                        inDrawer: true,
                        exact: true,
                        icon: <Plus size={16} />,
                        path: "/dashboard/inventory/stock/in",
                        component: InventoryStockIn
                    },
                    {
                        title: "Stock Out",
                        name: "inventory stock out",
                        inDrawer: true,
                        exact: true,
                        icon: <Minus size={16} />,
                        path: "/dashboard/inventory/stock/out",
                        component: InventoryStockOut
                    },

                ]
            },
            {
                title: "Suppliers",
                name: "supplier",
                inDrawer: true,
                icon: <Users size={16} />,
                children: [
                    {
                        title: "Supplier List",
                        name: "supplier list",
                        inDrawer: true,
                        exact: true,
                        icon: <List size={16} />,
                        path: "/dashboard/inventory/supplier/list",
                        component: InventorySupplierIndex
                    },
                    {
                        title: "Supplier Add",
                        name: "supplier add",
                        inDrawer: false,
                        exact: true,
                        icon: null,
                        path: "/dashboard/inventory/supplier/add",
                        component: InventorySupplierAdd
                    },
                    {
                        title: "Supplier List",
                        name: "supplier list",
                        inDrawer: false,
                        exact: true,
                        icon: null,
                        path: "/dashboard/inventory/supplier/edit/:id",
                        component: InventorySupplierEdit
                    },
                    {
                        title: "Supplier Show",
                        name: "supplier show",
                        inDrawer: false,
                        exact: true,
                        icon: null,
                        path: "/dashboard/inventory/supplier/show/:id",
                        component: InventorySupplierShow
                    },
                ]
            }
        ]
    },

    // IMEI/Separate Code Management
    {
        title: "IMEI/Separate Code Management",
        name: "imei",
        inDrawer: true,
        icon: <Code size={16} />,
        children: [
            {
                title: "Single Product Code",
                name: "imei single-product-code",
                exact: true,
                inDrawer: true,
                icon: <ChevronRight size={16} />,
                path: "/dashboard/imei/single",
                component: IMEISingleProductCode
            },
            {
                title: "Separate Product Code",
                name: "imei separate-product-code",
                exact: true,
                inDrawer: true,
                icon: <List size={16} />,
                path: "/dashboard/imei/multiple",
                component: IMEISeperateProductCode
            }
        ]

    },

    // Installment Management
    {
        title: "Installment Management",
        name: "installment-management",
        inDrawer: true,
        exact: true,
        icon: <BatteryCharging size={16} />,
        path: "/dashboard/installment-management",
        component: InstallmentIndex
    },

    // Messaging-Messenger
    {
        title: "Messaging/Messenger",
        name: "messaging-messenger",
        inDrawer: true,
        exact: true,
        icon: <MessageCircle size={16} />,
        path: "/messenger",
    },

    // Mechanic & Servicing
    {
        title: "Mechanic & Servicing",
        name: "mechanic-servicing",
        inDrawer: true,
        icon: <Tool size={16} />,
        children: [
            {
                title: "Mechanic",
                name: "mechanic-servicing mechanic",
                inDrawer: true,
                exact: true,
                icon: <Users size={16} />,
                path: "/dashboard/mechanic",
                component: MechanicServicingMechanicIndex
            },
            {
                title: "Mechanic Store",
                name: "mechanic-servicing mechanic-store",
                inDrawer: false,
                exact: true,
                icon: null,
                path: "/dashboard/mechanic/create",
                component: MechanicServicingMechanicStore
            },
            {
                title: "Mechanic Edit",
                name: "mechanic-servicing mechanic-edit",
                inDrawer: false,
                exact: true,
                icon: null,
                path: "/dashboard/mechanic/edit/:id",
                component: MechanicServicingMechanicEdit
            },
            {
                title: "Mechanic Show",
                name: "mechanic-servicing mechanic-show",
                inDrawer: false,
                exact: true,
                icon: null,
                path: "/dashboard/mechanic/show/:id",
                component: MechanicServicingMechanicShow
            },
            {
                title: "Servicing",
                name: "mechanic-servicing servicing",
                inDrawer: true,
                exact: true,
                icon: <Settings size={16} />,
                path: "/dashboard/servicing",
                component: MechanicServicingServicingIndex
            },
            {
                title: "Servicing Store",
                name: "mechanic-servicing servicing-store",
                inDrawer: false,
                exact: true,
                icon: null,
                path: "/dashboard/servicing/create",
                component: MechanicServicingServicingStore
            },
            {
                title: "Servicing Edit",
                name: "mechanic-servicing servicing-edit",
                inDrawer: false,
                exact: true,
                icon: null,
                path: "/dashboard/servicing/edit/:id",
                component: MechanicServicingServicingEdit
            },
            {
                title: "Servicing Show",
                name: "mechanic-servicing servicing-show",
                inDrawer: false,
                exact: true,
                icon: null,
                path: "/dashboard/servicing/show/:id",
                component: MechanicServicingServicingShow
            },
            {
                title: "Servicing Print",
                name: "mechanic-servicing servicing-print",
                inDrawer: false,
                exact: true,
                icon: null,
                path: "/dashboard/servicing/print/:id",
                component: MechanicServicingServicingPrint
            }
        ]
    },
    // Order
    {
        title: "Orders",
        name: "orders",
        inDrawer: true,
        exact: true,
        icon: <Truck size={16} />,
        path: "/dashboard/orders",
        component: PosOrderIndex,
    },
    {
        title: "Order Show",
        name: "orders show",
        inDrawer: false,
        exact: true,
        icon: <Tool size={16} />,
        path: "/dashboard/order/show/:id",
        component: PosOrderShow
    },
    // POS
    {
        title: "Point of Sale",
        name: "pos",
        inDrawer: true,
        exact: true,
        icon: <Database size={16} />,
        path: "/dashboard/pos/point-of-sell",
        component: PosPointOfSellIndex
    },

    // Product Return & Replacement
    {
        title: "Product Return & Replacement",
        name: "product-return-replacement",
        exact: true,
        inDrawer: true,
        icon: <ShoppingBag size={16} />,
        path: "/dashboard/product-return-replacement",
        component: ProductReturnAndReplacement
    },
    {
        title: "Product Return & Replacement Show",
        name: "product-return-replacement show",
        exact: true,
        inDrawer: false,
        icon: null,
        path: "/dashboard/product-return-replacement/show/:id",
        component: ProductReturnAndReplacementShow
    },

    // SMS
    {
        title: "SMS",
        name: "sms",
        inDrawer: true,
        exact: true,
        icon: <Mail size={16} />,
        path: "/dashboard/sms",
        component: SmsIndex
    },
    {
        title: "SMS Packages",
        name: "sms packages",
        inDrawer: false,
        exact: true,
        icon: false,
        path: "/dashboard/sms/packages",
        component: SmsPackages
    },
    {
        title: "SMS Send",
        name: "sms send",
        inDrawer: false,
        exact: true,
        icon: false,
        path: "/dashboard/sms/send",
        component: SmsSend
    },

    // Reports
    {
        title: "Reports",
        name: "reports",
        inDrawer: true,
        icon: <BarChart2 size={16} />,
        children: [
            {
                title: "Customer Report",
                name: "reports customer-report",
                inDrawer: true,
                exact: true,
                icon: <Users size={16} />,
                path: "/dashboard/reports/customers",
                component: ReportCustomer
            },
            {
                title: "Purchase & Due",
                name: "reports purchase-due-report",
                inDrawer: true,
                exact: true,
                icon: <DollarSign size={16} />,
                path: "/dashboard/reports/purchase-due",
                component: ReportPurchaseDue
            },
            {
                title: "Revenue Report",
                name: "reports revenue-report",
                inDrawer: true,
                exact: true,
                icon: <BarChart size={16} />,
                path: "/dashboard/reports/revenue",
                component: ReportRevenue
            },
            {
                title: "Sales Report",
                name: "reports sales-report",
                inDrawer: true,
                exact: true,
                icon: <DollarSign size={16} />,
                path: "/dashboard/reports/sales",
                component: ReportSales
            },
            {
                title: "Service Revenue Report",
                name: "reports service-revenue-report",
                inDrawer: true,
                exact: true,
                icon: <Tool size={16} />,
                path: "/dashboard/reports/service-revenue",
                component: ReportServiceRevenue
            },
            {
                title: "Stock Report",
                name: "reports stock-report",
                inDrawer: true,
                exact: true,
                icon: <BarChart2 size={16} />,
                path: "/dashboard/reports/stock",
                component: ReportStock
            }
        ]
    },

    // Notice management
    {
        title: "Notice",
        name: "notice",
        // exact: true,
        inDrawer: true,
        icon: <Bell size={16} />,
        children: [
            {
                title: "History",
                name: 'notice history',
                exact: true,
                inDrawer: true,
                icon: <List size={16}/>,
                path: "/dashboard/notice/index",
                component: NoticeIndex
            },
            {
                title: "Send",
                name: 'notice send',
                exact: true,
                inDrawer: true,
                icon: <Send size={16} />,
                path: "/dashboard/notice/send",
                component: NoticeSend
            }
        ]
        
    },

    // Settings
    {
        title: "Settings",
        name: "settings",
        inDrawer: true,
        exact: true,
        icon: <Settings size={16} />,
        path: "/dashboard/settings",
        component: SettingsIndex
    },

    // Static pages
    {
        title: "Term of Services",
        name: "term-of-services",
        inDrawer: false,
        exact: true,
        icon: null,
        path: "/dashboard/term-of-service",
        component: StaticTermOfServices
    },
    {
        title: "Data Policy",
        name: "data-policy",
        inDrawer: false,
        exact: true,
        icon: null,
        path: "/dashboard/data-policy",
        component: StaticDataPolicy
    },
    {
        title: "Cookie Policy",
        name: "cookie-policy",
        inDrawer: false,
        exact: true,
        icon: null,
        path: "/dashboard/cookies",
        component: StaticCookies
    },
    {
        title: "Community & Standard",
        name: "community-standard",
        inDrawer: false,
        exact: true,
        icon: null,
        path: "/dashboard/community-standard",
        component: StaticCommunityStandard
    },
    {
        title: "About",
        name: "about",
        inDrawer: false,
        exact: true,
        icon: null,
        path: "/dashboard/about",
        component: StaticAbout
    }
]