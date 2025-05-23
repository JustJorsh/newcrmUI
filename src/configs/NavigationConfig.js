import {
  DashboardOutlined,
  AppstoreOutlined,
  PaperClipOutlined,
  StarOutlined,
  FileOutlined,
  TeamOutlined,
  ForkOutlined,
  PullRequestOutlined,
  BellOutlined,
  CreditCardOutlined, 
  PayCircleOutlined,
  FolderOutlined, GroupOutlined, CloseOutlined, MessageOutlined, TagOutlined, PhoneOutlined
} from '@ant-design/icons';

const navigationConfig = (permissions = []) => {
  const dashBoardNavTree = [{
    key: 'dashboard',
    path: `/dashboard`,
    title: 'sidenav.dashboard',
    icon: DashboardOutlined,
    breadcrumb: false,
   // hidden: !permissions.includes('view.report'),
    submenu: [
    ],
  }];

  const customersNavTree = [{
    key: 'customers',
    path: `/users`,
    title: 'Customers',
    icon: AppstoreOutlined,
    breadcrumb: false,
    submenu: [
      {
        key: 'users',
        path: `/users`,
        title: 'Customer List',
        icon: TeamOutlined,
        breadcrumb: false,
        submenu: [],
        //hidden: !permissions.includes('view.user')
      },
      {
        key: 'usersearch',
        path: `/users/search`,
        title: 'Customer Search',
        icon: TeamOutlined,
        breadcrumb: false,
        submenu: [],
        //hidden: !permissions.includes('view.user')
      },
      {
        key: 'tickets',
        path: `/tickets`,
        title: 'Tickets',
        icon: MessageOutlined,
        breadcrumb: false,
        submenu: [],
        //hidden: !permissions.includes('view.loans')
      },
      {
        key: 'complainstickets',
        path: `/tickets/complains/list`,
        title: 'Complaints',
        icon: TagOutlined,
        breadcrumb: false,
        submenu: [],
        //hidden: !permissions.includes('view.loans')
      },
      {
        key: 'claims',
        path: `/claims`,
        title: 'Pending Claims Payments',
        icon: CreditCardOutlined,
        breadcrumb: false,
        submenu: [],
        //hidden: !permissions.includes('view.loans')
      },
      {
        key: 'cancellation',
        path: `/policy/cancellation`,
        title: 'Cancellation  History',
        icon:  CloseOutlined,
        breadcrumb: false,
        submenu: [],
        //hidden: !permissions.includes('view.loans')
      },
      {
        key: 'expense-statistics',
        path: `/claims-statistics`,
        title: 'Claims Statistics',
        icon: PayCircleOutlined,
        breadcrumb: false,
        submenu: [],
        //hidden: !permissions.includes('view.loans')
      },
      {
        key: 'group-policy',
        path: `/policy/group`,
        title: 'Group Policy',
        icon: GroupOutlined,
        breadcrumb: false,
        submenu: [],
        //hidden: !permissions.includes('view.loans')
      },
      {
        key: 'survey',
        path: `/survey`,
        title: 'Survey',
        icon: BellOutlined,
        breadcrumb: false,
        submenu: [],
        //hidden: !permissions.includes('view.loans')
      },
      {
        key: 'documents',
        path: `/documents`,
        title: 'Documents',
        icon: FolderOutlined,
        breadcrumb: false,
        submenu: []
      }
    ],
  }];

  const Lifecycle = [{
    key: 'lifecycle',
    path: `/lifecycle`,
    title: 'Life Cycle',
    icon: AppstoreOutlined,
    breadcrumb: false,
    submenu: [
      {
        key: 'renewalcycle',
        path: `/policy`,
        title: 'Renewal Cycle',
        breadcrumb: false,
        submenu: [],
      },
      {
        key: 'missedpremuim',
        path: `/policy/missed-premuim`,
        title: 'Missed Premium',
        breadcrumb: false,
        submenu: [],
        hidden: false,
      },
      {
        key: 'missedkyc',
        path: `/policy/missed-kyc`,
        title: 'Missed Kyc',
        breadcrumb: false,
        submenu: [],
        hidden: false,
      },
    ],
  }];

  const ProfileUpdate = [{
    key: 'profileupdate',
    path: `/profileupdate`,
    title: 'Profile Update',
    icon: AppstoreOutlined,
    breadcrumb: false,
    submenu: [
      {
        key: 'upload-documents',
        path: `/upload-documents`,
        title: 'Upload Document',
        icon: FolderOutlined,
        breadcrumb: false,
        submenu: []
      },
      {
        key: 'upload-phone',
        path: `/upload-phonecalls`,
        title: 'Upload Phone Calls',
        icon: PhoneOutlined,
        breadcrumb: false,
        submenu: []
      }
    ],
  }];

  return [
    ...dashBoardNavTree,
    ...customersNavTree,
    ...Lifecycle,
    ...ProfileUpdate
  ]
};

export default navigationConfig;
