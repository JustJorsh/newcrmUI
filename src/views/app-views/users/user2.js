import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tabs, Table, Divider, Modal, Menu, message, Tag, Button, Popconfirm, Switch, Input } from 'antd';
import { Icon } from 'components/util-components/Icon';
import { MailOutlined, PhoneOutlined, StarOutlined, UserOutlined, LinkOutlined, EyeOutlined, DeleteOutlined, CompassOutlined, MessageOutlined, SearchOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex';
import AxiosClient from 'services/AxiosClient';
import { useParams, useHistory } from 'react-router-dom';
import moment from 'moment';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { useDispatch } from 'react-redux';
import StatementModel from './statement';
import FileModel from './file';
import ViewDocumentModal from './viewDocuments';
import CancellationModal from './cancellation-history';
import MissedPremiumModal from './missed-premium';
import ProfileUpdateModal from './profile-updates';
import NotesModal from '../tickets/notes';

const { TabPane } = Tabs;

const getStatus = (status) => {
    if (status === "not") {
        return "red";
    }
    if (status === "success") {
        return "cyan";
    }
    return "";
};

function returnTicketStatus(sts) {
    switch (sts) {
        case 2:
            return 'Open';
        case 3:
            return 'Pending';
        case 4:
            return 'Resolved';
        case 5:
            return 'Closed';
        case 6:
            return 'Waiting on Customer';
        case 7:
            return 'Waiting on Third Party'
        case 8:
            return 'Issue escalated';
        case 9:
            return 'Awaiting Resolver Group Feedback'
        case 10:
            return 'Escalated to Finance';
        case 11:
            return 'Escalated to Operation'
        case 12:
            return 'Escalated to IT';
        case 13:
            return 'Escalated to Legal';
        case 14:
            return 'Escalated to Marketing'
        case 15:
            return 'Escalated to Brand'
        case 16:
            return 'Escalated to Claims';
        case 17:
            return 'Unresolved but closed';

    }
}

function returnLoyaltyTier(sts) {
    switch (sts) {
        case "Regular":
            return "#f5222d";
        case "Classic":
            return '#C0C0C0';
        case "All-Star":
            return '#b9f2ff';
        case "Prestige":
            return '#FFD700';
    }
}

function returnClaimSource(sts) {
    switch (sts) {
        case 1:
            return 'Not Paid';
        case 2:
            return 'Paid';
        case 3:
            return 'Rejected';
        case 4:
            return 'On-Hold';
        case 5:
            return 'Old';
        case 8:
            return 'Pending for Recoveries';
        case 9:
            return 'Pending';
    }
}

const User = () => {
    const avatarSize = 150;
    const params = useParams();
    const history = useHistory();
    const dispatch = useDispatch();

    // const { user: userData, success } = useSelector((state) => state.users);
    // let { data: user } = userData;
    const [user, setUser] = useState({});
    const [cus, setCus] = useState({});
    const [active, setActive] = useState('general');
    const [active_com, setActiveCom] = useState('email');
    const [active_rating, setRatingCom] = useState('satisfactory_survey');
    const [tickets, setTickets] = useState([]);
    const [policy, setPolicy] = useState([]);
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(false);
    const [customer, setCustomers] = useState({});
    const [complains, setComplains] = useState([]);
    const [cancellation, setCancellation] = useState([]);
    const [statement, setStatement] = useState();
    const [allstatement, setAllStatement] = useState();
    const [documents, setDocuments] = useState([]);
    const [profileUpdates, setProfileUpdates] = useState([]);
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(10)
    const [profile, setProfile] = useState();
    const [missed, setMissed] = useState([]);
    const [email, setEmail] = useState([]);
    const [sms, setSMS] = useState([]);
    const [phone, setPhone] = useState([]);
    const [file, setFile] = useState();
    const [viewDocument, setViewDocument] = useState();
    const [newUser, setNewUser] = useState();
    const [customerbehaviour, setcustomerbehaviour] = useState("")
    const [modal1Open, setModal1Open] = useState(false);
    const [networth, setNetWorth] = useState("");
    const [loyaltyTier, setLoyaltyTier] = useState("");
    const [status, setStatus] = useState("");
    const [notes, setNotes] = useState();
    const [satisfactorySurvey, setSatisfactorySurvey] = useState([]);
    const [experienceEffortSurvey, setExperienceEffortSurvey] = useState([]);
    const [netPerformanceSurvey, setNetPerformanceSurvey] = useState([]);
    const [isCompanyA, setIsCompanyA] = useState(true); // Initially set to Company A
    const [mobile, setMobile] = useState('');
    const [emailSearch, setEmailSearch] = useState('');
    const [policyNumber, setpolicyNumber] = useState('');

    const fetchProfileUpdate = async (page = 1, search = '', sortBy = 'created_on', sortDir = 'DESC', limit = 10) => {
        setLoading(true)
        try {
            const client = await AxiosClient();
            const response = await client.get(`customers/updates/${params?.id}/${user?.CompanyId}?page=${page}&limit=${limit}&sort_by=${sortBy}&sort_dir=${sortDir}&search=${search ? search : ''}&search_fields=notifications.message,notifications.title`);
            console.log("profilr", response);
            setProfileUpdates(response.data.data.customer)
            setTotal(response.data.data.page_info.total)
            setPage(response.data.data.page_info.page)
        } catch (error) {
            setProfileUpdates([])
        }
        setLoading(false)
    }

    const deleteProfileUpdate = async (id) => {
        const hide = message.loading("Processing");
        try {
            const client = await AxiosClient();
            const response = await client.delete(`customers/updates/${id}/${customer.ID}`);
            if (response.data.status !== "success")
                throw new Error(response?.data?.message);
            message.success(response?.data?.message);
            fetchProfileUpdate();
        } catch (error) {
            message.error(
                error.response?.data?.message ||
                error.response?.statusText ||
                error.message ||
                "Seems like something went wrong with your request. Please try again."
            );
        }
        hide();
    };

    const fetchTickets = async (email) => {
        setLoading(true);
        try {
            const client = await AxiosClient();
            const response = await client.get(
                `customers/freshdesk/ticketbyemail/${email}`
            );

            console.log("ticket", response);
            const complain = response?.data?.data.filter((x) => x.type === 'Complain');
            if (complain) setComplains(complain);

            setTickets(response.data.data);
        } catch (error) {
            setTickets([]);
        }
        setLoading(false);
    };

    const fetchPolicyGeneral = async (id) => {
        setLoading(true);
        try {
            const client = await AxiosClient();
            const response = await client.get(`customers/policies/general/${id}`);
            console.log("policy_general", id, response?.data?.data);
            if (response?.data?.data.length === 1) setNewUser(false)
            else if (response?.data?.data.length > 1) setNewUser(true)

            const personal = response?.data?.data.filter(function (policy) {
                return policy?.PolicyList?.PolicyTypeName.includes("Personal Accident")
            });
            const comprehensive = response?.data?.data.filter(x => x.PolicyList?.PolicyTypeName === 'Comprehensive');
            const thrid_party = response?.data?.data.filter(x => x.PolicyList?.PolicyTypeName === 'Third Party');
            const premium = response?.data?.data.filter(x => x.PolicyList?.NetPremium >= 400000);

            if (response?.data?.data.length > 0) {
                let premium = 0;
                premium = response?.data?.data.reduce((acc, b) => {
                    return acc + parseFloat(b.PolicyList?.NetPremium || 0);
                }, 0);
                // response?.data?.data.reduce(function (a, b) {
                //   premium = premium + parseFloat(b.PolicyList?.NetPremium);
                // }, 0);
                await loyalty_tier(premium);
                setNetWorth(Number(premium || 0).toLocaleString());
            }

            if (comprehensive.length > 0) {
                setcustomerbehaviour("Satisfied customer - engage for more products");
            }

            if (comprehensive.length > 0 && personal > 0) {
                setcustomerbehaviour("Protective customer - introduce more products");
            }
            if (thrid_party.length > 0 && comprehensive.length > 0) {
                setcustomerbehaviour("Satisfied customer - engage for more products");
            }
            if (premium.length > 0) {
                setcustomerbehaviour("luxury customer - introduce more products");
            }
            console.log(personal, comprehensive, thrid_party, premium);

            if (response?.data?.data.length > 0) {
                let premium = 0;
                // response?.data?.data.reduce(function (a, b) {
                //   if (moment().isAfter(`${b.PolicyList?.ExpiryDate}`, 'day') === false) { premium = premium + parseFloat(b.PolicyList?.NetPremium); }
                // }, 0);
                premium = response?.data?.data.reduce((acc, b) => {
                    // Check if the current date is NOT after the expiry date
                    if (!moment().isAfter(b.PolicyList?.ExpiryDate, 'day')) {
                        return acc + parseFloat(b.PolicyList?.NetPremium || 0);
                    }
                    return acc;
                }, 0);
                if (premium > 0) setStatus("Active")
                else setStatus("Not Active")
            }

            setPolicy(response.data.data);
        } catch (error) {
            setPolicy([]);
        }
        setLoading(false);
    };

    function returnSource(sts) {
        switch (sts) {
            case 1:
                return 'Email';
            case 2:
                return 'Portal';
            case 3:
                return 'Phone';
            case 7:
                return 'Chat';
            case 9:
                return 'Feedback Widget';
            case 10:
                return 'Outbound Email';
        }
    }

    async function loyalty_tier(networth) {
        if (+networth < 500000) setLoyaltyTier("Regular");
        if (+networth < 1999999 && +networth > 500000) setLoyaltyTier("Classic");
        if (+networth < 4999999 && +networth > 2000000) setLoyaltyTier("All-Star");
        if (+networth > 5000000) setLoyaltyTier("Prestige");
    }

    const fetchPolicyLife = async (id) => {
        setLoading(true);
        try {
            const client = await AxiosClient();
            const response = await client.get(`customers/policies/life/${id}`);
            console.log("policy2", id, response?.data?.data)
            if (response?.data?.data.length === 1) setNewUser(false)
            else if (response?.data?.data.length > 1) setNewUser(true)

            // const personal = response?.data?.data.filter(function (policy) {
            //   return policy.PLAN_NAME.includes("Personal Accident")
            // });
            // const comprehensive = response?.data?.data.filter(x => x.PLAN_NAME === 'Comprehensive');
            // const thrid_party = response?.data?.data.filter(x => x.PLAN_NAME === 'Third Party');
            const platinum_premium = response?.data?.data.filter(x => x.PERIODIC_PREMIUM_LC > 500000);
            const gold_premium = response?.data?.data.filter(x => x.PERIODIC_PREMIUM_LC >= 100000 && x.PERIODIC_PREMIUM_LC <= 300000);
            const silver_premium = response?.data?.data.filter(x => x.PERIODIC_PREMIUM_LC >= 300000 && x.PERIODIC_PREMIUM_LC <= 500000);
            const regular_premium = response?.data?.data.filter(x => x.PERIODIC_PREMIUM_LC < 100000);

            if (regular_premium.length > 0) {
                setcustomerbehaviour("Regular customer");
            }
            if (silver_premium.length > 0) {
                setcustomerbehaviour("Silver customer");
            }
            if (gold_premium.length > 0) {
                setcustomerbehaviour("Gold customer");
            }
            if (platinum_premium.length > 0) {
                setcustomerbehaviour("Platinum customer");
            }

            if (response?.data?.data.length > 0) {
                const networth = response?.data?.data.reduce(function (a, b) {
                    if (moment().isAfter(`${b.expiryDate}`, 'day') === false) { return parseFloat(a) + parseFloat(b.PERIODIC_PREMIUM_LC); }
                }, 0);

                if (networth > 0) setStatus("Active")
                else setStatus("Not Active")
            }

            setPolicy(response.data.data);
        } catch (error) {
            setPolicy([]);
        }
        setLoading(false);
    };

    const fetchClaims = async (id) => {
        setLoading(true);
        try {
            const client = await AxiosClient();
            const response = user?.CompanyId === 2 ? await client.get(`customers/claims/life/${id}`) : await client.get(`customers/claims/general/${id}`);
            console.log("claims", response.data.data);
            if (response?.data?.data?.length || response?.data?.data?.data?.length > 0)
                user?.CompanyId === 1 ? setClaims(response?.data?.data) : setClaims(response?.data?.data?.data)
        } catch (error) {
            setClaims([]);
        }
        setLoading(false);
    };

    const fetchDocument = async (record) => {
        try {
            setLoading(true);
            const client = await AxiosClient();
            console.log("documents", record);
            const response = await client.get(`customers/document/${record?.PolicyList?.CompanyID}/${record?.PolicyList?.SegmentCode}/${record?.PolicyList?.ClassID}`);
            setViewDocument(response?.data?.data?.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            return '';
        }
        setLoading(false);
    };

    const ViewDocuments = async (file) => {
        window.open(file, '_blank', 'noopener,noreferrer');
    }

    const sendDocumentMail = async (link) => {
        setLoading(true);
        try {
            const client = await AxiosClient();
            const doc_link = customer?.CompanyId === 1 ? "customers/general/send-document-to-user-email" : "customers/life/send-document-to-user-email"
            const response = await client.post(`${doc_link}`, { email: customer?.Email, documentLink: link });
            if (response?.data?.data?.success === "success") {
                message.success(response?.data?.data?.message);
            }
        } catch (error) {
            message.error(error);
        }
        setLoading(false);
    }

    const fetchCancellationHistory = async (record) => {
        setLoading(true);
        try {
            const client = await AxiosClient();
            const response = await client.get(`customers/cancellation/life/${record?.SEGMENT_CODE}`);
            console.log(response?.data?.data?.data);
            if (response?.data?.data?.data?.length > 0) setCancellation(response?.data);
        } catch (error) {
            setCancellation([]);
        }
        setLoading(false);
    };

    const fetchStatement = async (record) => {
        setLoading(true);
        try {
            const client = await AxiosClient();
            const response = await client.get(`customers/statement/life/${record?.SegmentCode}`);
            setStatement(response?.data?.data);
        } catch (error) {
            setStatement({});
        }
        setLoading(false);
    };

    const fetchAllStatement = async (id) => {

        setLoading(true);
        try {
            const client = await AxiosClient();
            const response = await client.get(`customers/statement/customer/life/${id}`);

            if (response?.data?.data.length > 0) {
                const networth = response?.data?.data.reduce(function (a, b) {
                    if (moment().isAfter(`${b.expiryDate}`, 'day') === false) { return parseFloat(a) + parseFloat(b.premium); }
                }, 0);
                await loyalty_tier(networth);
                setNetWorth(Number(networth || 0).toLocaleString());
            }

            setAllStatement(response?.data?.data);
        } catch (error) {
            setAllStatement([]);
        }
        setLoading(false);
    };

    const generalfetchAllDocument = async (id) => {
        try {
            const client = await AxiosClient();
            const response = await client.get(`customers/general_documents/${id}`);
            setDocuments(response?.data?.data?.data);
        } catch (error) {
            return '';
        }
    };

    const generalMissedPremuim = async (row) => {
        try {
            setLoading(true);
            const client = await AxiosClient();
            const response = await client.get(`customers/missed-premium/life/${row?.ID}`);
            console.log("missed", response?.data?.data?.missedPremium)
            setMissed(response?.data?.data?.missedPremium);
            if (response?.data?.data?.missedPremium.length === 0) message.warning("No record")
        } catch (error) {
            console.log(error);
            setLoading(false);
            setMissed([])
        }
        setLoading(false);
    };

    const lifefetchAllDocument = async (id) => {
        try {
            const client = await AxiosClient();
            const response = await client.get(`customers/life_documents/${id}`);
            setDocuments(response?.data?.data?.data);
        } catch (error) {
            return '';
        }
    };

    const fetchEmails = async (email) => {
        setLoading(true);
        try {
            const client = await AxiosClient();
            const response = await client.get(`customers/email/${email}`);
            console.log("email", response);
            setEmail(response?.data?.data?.data);
        } catch (error) {
            setEmail({});
        }
        setLoading(false);
    };

    const fetchSMS = async (Mobile) => {
        setLoading(true);
        try {
            const client = await AxiosClient();
            const response = await client.get(`customers/sms/${Mobile}`);
            setSMS(response?.data?.data?.data);
        } catch (error) {
            setSMS({});
        }
        setLoading(false);
    };

    const fetchPhone = async (Mobile) => {
        setLoading(true);
        try {
            if (Mobile.indexOf("0") === 0) Mobile = Mobile.substr(1);
            const client = await AxiosClient();
            const response = await client.get(`https://www.eskabatch.services.heirslifeassurance.com/api/v1/general/phonerecs/?CallerNumber=${Mobile}`);
            console.log(response?.data);
            setPhone(response?.data);
        } catch (error) {
            setPhone([]);
        }
        setLoading(false);
    };

    const viewClaim = (row) => {
        console.log(row);
        if ((user?.CompanyId || customer?.CompanyId) === 1) {
            window.open(`https://office.heirslifeassurance.com/claim/${row?.SegmentCode}/company/${row?.CompanyID}`, '_blank', 'noopener,noreferrer');
        }
        else if ((user?.CompanyId || customer?.CompanyId) === 2) {
            window.open(`https://office.heirslifeassurance.com/claim/${row?.SegmentCode}/company/${row?.CompanyID}`, '_blank', 'noopener,noreferrer');
        }
    }

    const directDebit = (row) => {
        if (row.directDebit.isActive) {
            message.info("Direct debit status is active");
        }
        else {
            message.info("Direct Debit status is in-active");
        }
    }

    const dropdownMenu = (row) => (
        <Menu>
            {
                (user?.CompanyId || customer?.CompanyId) === 1 ?
                    <Menu.Item key='1'>
                        <Flex alignItems='center'>
                            <EyeOutlined />
                            <span className='ml-2' onClick={() => fetchDocument(row)}>View Document</span>
                        </Flex>
                    </Menu.Item> : ""
            }
            {
                (user?.CompanyId || customer?.CompanyId) === 2 ?
                    <Menu.Item key='2'>
                        <Flex alignItems='center'>
                            <EyeOutlined />
                            <span className='ml-2' onClick={() => directDebit(row)}>Direct Debit</span>
                        </Flex>
                    </Menu.Item> : ""
            }
            {
                (user?.CompanyId || customer?.CompanyId) === 2 ?
                    <Menu.Item key='2'>
                        <Flex alignItems='center'>
                            <EyeOutlined />
                            <span className='ml-2' onClick={() => fetchStatement(row)}>View Statement</span>
                        </Flex>
                    </Menu.Item> : ""
            }
            {
                (user?.CompanyId || customer?.CompanyId) === 2 ?
                    <Menu.Item key='3'>
                        <Flex alignItems='center'>
                            <EyeOutlined />
                            <span className='ml-2' onClick={() => window.open(row?.NOTE, '_blank', 'noopener,noreferrer')}>View Note</span>
                        </Flex>
                    </Menu.Item> : ""
            }
            {
                (user?.CompanyId || customer?.CompanyId) === 2 ?
                    <Menu.Item key='4'>
                        <Flex alignItems='center'>
                            <EyeOutlined />
                            <span className='ml-2' onClick={() => fetchCancellationHistory(row)}>View Cancellation History</span>
                        </Flex>
                    </Menu.Item> : ""
            }
            {
                (user?.CompanyId || customer?.CompanyId) === 2 ?
                    <Menu.Item key='5'>
                        <Flex alignItems='center'>
                            <EyeOutlined />
                            <span className='ml-2' onClick={() => generalMissedPremuim(row)}>Missed Premium</span>
                        </Flex>
                    </Menu.Item> : ""
            }
        </Menu>
    );

    const fetchSatisfactorysurvey = async (Mobile) => {
        setLoading(true);
        try {
            if (Mobile.indexOf("0") === 0) Mobile = Mobile.substr(1);
            const client = await AxiosClient();
            const response = await client.get(`https://www.eskabatch.services.heirslifeassurance.com/api/v1/cx/getCustomerCSat?email=${Mobile}`);
            //console.log("survey", response?.data);
            setSatisfactorySurvey(response?.data);
        } catch (error) {
            setSatisfactorySurvey([]);
        }
        setLoading(false);
    };

    const fetchExperienceEffortSurvey = async (Mobile) => {
        setLoading(true);
        try {
            if (Mobile.indexOf("0") === 0) Mobile = Mobile.substr(1);
            const client = await AxiosClient();
            const response = await client.get(`https://www.eskabatch.services.heirslifeassurance.com/api/v1/cx/getCustomerCxEffort/?email=${Mobile}`);
            //console.log(response?.data);
            setExperienceEffortSurvey(response?.data);
        } catch (error) {
            setExperienceEffortSurvey([]);
        }
        setLoading(false);
    };

    const fetchNetPerformanceSurvey = async (Mobile) => {
        setLoading(true);
        try {
            if (Mobile.indexOf("0") === 0) Mobile = Mobile.substr(1);
            const client = await AxiosClient();
            const response = await client.get(`https://www.eskabatch.services.heirslifeassurance.com/api/v1/cx/getCustomerNpsSurvey?email=${Mobile}`);
            //console.log(response?.data);
            setNetPerformanceSurvey(response?.data);
        } catch (error) {
            setNetPerformanceSurvey([]);
        }
        setLoading(false);
    };

    const items = [
        { label: 'Personal', key: 'general' },
        { label: 'Policy', key: 'policy' },
        { label: 'Claims', key: 'claims' },
        { label: 'Documents', key: 'documents' },
        { label: 'Statements', key: 'statements' },
        { label: 'Communications', key: 'communications' },
        { label: 'Complaints History', key: 'complains' },
        { label: 'Profile Updates', key: 'profile_updates' },
        { label: 'Customer Rating', key: 'customer_rating' }
    ];

    const items_communications = [
        { label: `Email (${email.length || 0})`, key: 'email' },
        { label: `SMS (${sms.length || 0})`, key: 'sms' },
        { label: `Phone (${phone.length || 0})`, key: 'phone' },
        { label: `Tickets interactions (${tickets.length || 0})`, key: 'tickets' }
    ];

    const items_customer_rating = [
        { label: 'Satisfactory Survey', key: 'satisfactory_survey' },
        { label: 'Experience Effort Survey', key: 'experience_effort_survey' },
        { label: 'Net Performance Survey', key: 'net_performance_survey' }
    ];

    const tableRatingColumns = [
        {
            title: 'Date',
            dataIndex: 'date',
        },
        {
            title: 'Channel',
            dataIndex: 'Channel'
        },
        {
            title: 'Rateclaim',
            dataIndex: 'Rateclaim',
        },
        {
            title: 'Feedback',
            dataIndex: 'Feedback'
        }
    ];

    const fetchUserDetails = async (Mobile, email, policyNumber) => {
        const hide = message.loading("Processing",20);
        try {
            const client = await AxiosClient();
            
            const response = await client.get(`customers/list/${Mobile || email}`);
            const company = response?.data?.data?.hLAPolicyIDs ? 2 : 1;
            const user_data = await getUsers({ pageNumber: 1, rows: 10, cId: company, email, mobile: Mobile, policyNumber });
            if (user_data?.data?.data?.Data[0]) {
                setUser(user_data?.data?.data?.Data[0])

                setCus(user_data?.data?.data?.Data[0]);
                const cu = user_data?.data?.data?.Data[0];

                console.log("cu", cu);
                setCustomers(cu);
                fetchTickets(`${cu?.Email}`);
                fetchClaims(cu.ID);
                fetchEmails(cu?.Email);
                fetchSMS(cu?.Mobile);
                fetchPhone(cu?.Mobile);
                fetchSatisfactorysurvey(cu?.Email);
                fetchExperienceEffortSurvey(cu?.Email);
                fetchNetPerformanceSurvey(cu?.Email);

                if (cu.Email.toString().trim() === "" || (cu.Mobile.toString().trim() === "" && cu.Phone.toString().trim() === "") || cu.MainAddress.toString().trim() === "") {
                    setModal1Open(true);
                }

                if (company === 2) {
                   await fetchAllStatement(cu.ID);
                }
                if (company === 2) {
                  await  fetchPolicyLife(cu.ID);
                } else {
                   await fetchPolicyGeneral(cu.ID);
                }

                if (company === 2) {
                   await lifefetchAllDocument(cu.ID);
                } else {
                   await generalfetchAllDocument(cu.ID);
                }

               await fetchProfileUpdate();
                hide();
            }
            else {
                setUser({});
            }

        } catch (error) {
            setUser({});
        }
       
    };

    const getUsers = async ({ pageNumber = 1, rows = 10, cId = 1, email = '', mobile = '', policyNumber = '' }) => {
        try {
            try {
                const client = await AxiosClient();
                const response = await client.get(`customers/?PageNumber=${pageNumber}&RowsSizePerPage=${rows}&CompanyId=${cId}&Phone=${mobile}&Email=${email}&PolicyNumber=${policyNumber}`);
                return response;
            } catch (error) {
                return Promise.reject(error);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const onChange = async (checked) => {
        const hide = message.loading("Processing");
        try {
            setLoading(true);
            let company = customer.CompanyId;
            const Mobile = customer.Mobile;
            setCustomers(null);

            company = company === 2 ? 1 : company === 1 ? 2 : 0

            if (company === 0)
                return false;

            const user_data = await getUsers({ pageNumber: 1, rows: 10, cId: company, email: '', mobile: Mobile, policyNumber: '' });
            if (user_data?.data?.data?.Data[0]) {
                setUser(user_data?.data?.data?.Data[0])

                setCus(user_data?.data?.data?.Data[0]);
                const cu = user_data?.data?.data?.Data[0];

                setCustomers(cu);
                fetchTickets(`${cu?.Email}`);
                fetchClaims(cu.ID);
                fetchEmails(cu?.Email);
                fetchSMS(cu?.Mobile);
                fetchPhone(cu?.Mobile);
                fetchSatisfactorysurvey(cu?.Email);
                fetchExperienceEffortSurvey(cu?.Email);
                fetchNetPerformanceSurvey(cu?.Email);

                if (cu.Email.toString().trim() === "" || (cu.Mobile.toString().trim() === "" && cu.Phone.toString().trim() === "") || cu.MainAddress.toString().trim() === "") {
                    setModal1Open(true);
                }

                if (company === 2) {
                    fetchAllStatement(cu.ID);
                }
                if (company === 2) {
                    fetchPolicyLife(cu.ID);
                } else {
                    fetchPolicyGeneral(cu.ID);
                }

                if (company === 2) {
                    lifefetchAllDocument(cu.ID);
                } else {
                    generalfetchAllDocument(cu.ID);
                }

                fetchProfileUpdate();
            }
            else {
                setUser({});
            }
            setLoading(false)
            setIsCompanyA(checked); // Update the company based on the switch

        }
        catch (error) {
            console.log(error);
        }
        hide();
    };

    const ProfileInfo = (
        <>
            <Flex alignItems='center' justifyContent='between' mobileFlex={false}>
                <Flex
                    className="mr-md-3 mb-3"
                    alignItems="center"
                    key="search-containers"
                    mobileFlex={false}
                    style={{ gap: '1rem' }} // Adds space between input and button
                >
                    <Input
                        placeholder="Enter phone number"
                        prefix={<SearchOutlined />}
                        onChange={(e) => setMobile(e.target.value)}
                    />
                    <Input
                        placeholder="Enter email"
                        prefix={<SearchOutlined />}
                        onChange={(e) => setEmailSearch(e.target.value)}
                    />
                    {/* <Input
                        placeholder="Enter policy number"
                        prefix={<SearchOutlined />}
                        onChange={(e) => setpolicyNumber(e.target.value)}
                    /> */}
                    <Button
                        style={{
                            backgroundColor: '#f5222d', // Color for the button
                            borderColor: 'red', // Sets border color
                        }}
                        onClick={() => fetchUserDetails(mobile, emailSearch, policyNumber)} // Pass the mobile state value to the function
                        type="primary"
                    >
                        Search
                    </Button>
                </Flex>

            </Flex>
            <br />
            <br />
            <Card>

                <Row justify='center'>
                    <Col sm={24} md={23}>
                        <div className='d-md-flex'>


                            <div className='ml-md-4 w-100'>
                                <Flex
                                    alignItems='center'
                                    mobileFlex={false}
                                    className='mb-3 text-md-left text-center'
                                >
                                    <h2 className='mb-0'>{user?.Name}</h2>
                                    <div
                                        className="mt-3"
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '1rem',
                                            justifyContent: 'flex-end', // Aligns the Switch to the right
                                            alignItems: 'center', // Keeps the text and switch aligned vertically
                                            flex: 1, // Ensures this div takes up the remaining space
                                        }}
                                    >
                                        <Switch
                                            checked={isCompanyA}
                                            onChange={onChange}
                                            checkedChildren={
                                                customer?.CompanyId === 1
                                                    ? "Heirs General Insurance" :
                                                    customer?.CompanyId === 2 ?
                                                        "Heirs Life Assurance" : ""
                                            }
                                            unCheckedChildren={
                                                customer?.CompanyId === 1
                                                    ? "Heirs General Insurance" :
                                                    customer?.CompanyId === 2 ?
                                                        "Heirs Life Assurance" : ""

                                            }
                                            style={{
                                                backgroundColor: isCompanyA ? '#f5222d' : '#f5222d', // Color when checked (for Company A)
                                                borderColor: 'red', // Sets border color
                                            }}
                                        />

                                    </div>
                                </Flex>
                                <Row gutter='16'>
                                    <Col xs={24} sm={24} md={8}>
                                        <Row className='mb-2'>
                                            <Col xs={12} sm={12} md={12}>
                                                <Icon
                                                    type={CompassOutlined}
                                                    className='text-primary font-size-md'
                                                />
                                                <span className='text-muted ml-2'>Company:</span>
                                            </Col>
                                            <Col xs={12} sm={12} md={12}>
                                                <span className='font-weight-semibold'>
                                                    {user?.CompanyId === 2 ? 'Heirs Life Assurance' : user?.CompanyId === 1 ? 'Heirs General' : ""}
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row className='mb-2'>
                                            <Col xs={12} sm={12} md={12}>
                                                <Icon
                                                    type={LinkOutlined}
                                                    className='text-primary font-size-md'
                                                />
                                                <span className='text-muted ml-2'>Customer:</span>
                                            </Col>
                                            <Col xs={12} sm={12} md={112}>
                                                <span className='font-weight-semibold'>
                                                    {newUser === true ? "Returning Customer" : newUser === false ? "New Customer" : ""}     
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row className='mb-2'>
                                            <Col xs={12} sm={12} md={12}>
                                                <Icon
                                                    type={UserOutlined}
                                                    className='text-primary font-size-md'
                                                />
                                                <span className='text-muted ml-2'>CustomerNo:</span>
                                            </Col>
                                            <Col xs={12} sm={12} md={12}>
                                                <span className='font-weight-semibold'>
                                                    {customer?.CustomerNo || user?.CustomerNo}
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row className='mb-2'>
                                            <Col xs={12} sm={12} md={12}>
                                                <Icon
                                                    type={UserOutlined}
                                                    className='text-primary font-size-md'
                                                />
                                                <span className='text-muted ml-2'>Customer Type:</span>
                                            </Col>
                                            <Col xs={12} sm={12} md={12}>
                                                <span className='font-weight-semibold'>
                                                    {user?.CompanyId === 2 && user?.CustomerType === 124 ? 'Indivdual' : user?.CompanyId === 2 && user?.CustomerType === 171 ? `Company ${user?.CommercialName}` :
                                                        user?.CompanyId === 1 && user?.CustomerType === 124 ? 'Indivdual' : user?.CompanyId === 1 && user?.CustomerType === 143 ? `Company ${user?.CommercialName}` : ''
                                                    }
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row className='mb-2'>
                                            <Col xs={12} sm={12} md={12}>
                                                <Icon
                                                    type={MailOutlined}
                                                    className='text-primary font-size-md'
                                                />
                                                <span className='text-muted ml-2'>Email:</span>
                                            </Col>
                                            <Col xs={12} sm={12} md={112}>
                                                <span className='font-weight-semibold'>{user?.Email || customer?.Email}</span>
                                            </Col>
                                        </Row>
                                        <Row className='mb-2'>
                                            <Col xs={12} sm={12} md={12}>
                                                <Icon
                                                    type={PhoneOutlined}
                                                    className='text-primary font-size-md'
                                                />
                                                <span className='text-muted ml-2'>Phone:</span>
                                            </Col>
                                            <Col xs={12} sm={12} md={12}>
                                                <span className='font-weight-semibold'>
                                                    {user?.Mobile || customer?.Mobile}
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row className='mb-2'>
                                            <Col xs={12} sm={12} md={12}>
                                                <Icon
                                                    type={PhoneOutlined}
                                                    className='text-primary font-size-md'
                                                />
                                                <span className='text-muted ml-2'>Phone 2:</span>
                                            </Col>
                                            <Col xs={12} sm={12} md={12}>
                                                <span className='font-weight-semibold'>
                                                    {user?.Phone || customer?.Phone}
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row className='mb-2'>
                                            <Col xs={12} sm={12} md={12}>
                                                <Icon
                                                    type={StarOutlined}
                                                    className='text-primary font-size-md'
                                                />
                                                <span className='text-muted ml-2'>Date of Creation:</span>
                                            </Col>
                                            <Col xs={12} sm={12} md={12}>
                                                <span className='font-weight-semibold'>
                                                    {user?.CreationDate || customer?.CreationDate
                                                        ? moment(user?.CreationDate || customer?.CreationDate).format('DD-MM-YYYY')
                                                        : ""}
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row className='mb-2'>
                                            <Col xs={12} sm={12} md={12}>
                                                <Icon
                                                    type={LinkOutlined}
                                                    className='text-primary font-size-md'
                                                />
                                                <span className='text-muted ml-2'>Address:</span>
                                            </Col>
                                            <Col xs={12} sm={12} md={12}>
                                                <span className='font-weight-semibold'>
                                                    {user?.MainAddress || customer?.MainAddress}
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row className='mb-2'>
                                            <Col xs={12} sm={12} md={12}>
                                                <Icon
                                                    type={LinkOutlined}
                                                    className='text-primary font-size-md'
                                                />
                                                <span className='text-muted ml-2'>Status:</span>
                                            </Col>
                                            <Col xs={12} sm={12} md={11}>
                                                <span className='font-weight-semibold'>
                                                    {/* {newUser === true ? "Returning Customer" : newUser === false ? "New Customer" : ""} */}
                                                    <Tag color={status === "Active" ? getStatus("success") : getStatus("not")}>{status}</Tag>
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row className='mb-2'>
                                            <Col xs={12} sm={12} md={12}>
                                                <Icon
                                                    type={LinkOutlined}
                                                    className='text-primary font-size-md'
                                                />
                                                <span className='text-muted ml-2'>Behaviour:</span>
                                            </Col>
                                            <Col xs={12} sm={12} md={12}>
                                                <span className='font-weight-semibold'>
                                                    {customerbehaviour}
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row className='mb-2'>
                                            <Col xs={12} sm={12} md={12}>
                                                <Icon
                                                    type={LinkOutlined}
                                                    className='text-primary font-size-md'
                                                />
                                                <span className='text-muted ml-2'>NetWorth:</span>
                                            </Col>
                                            <Col xs={12} sm={12} md={12}>
                                                <span className='font-weight-semibold'>
                                                    {networth}
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row className='mb-2'>
                                            <Col xs={12} sm={12} md={12}>
                                                <Icon
                                                    type={LinkOutlined}
                                                    className='text-primary font-size-md'
                                                />
                                                <span className='text-muted ml-2'>Loyalty Tier:</span>
                                            </Col>
                                            <Col xs={12} sm={12} md={12}>
                                                <span className='font-weight-semibold'>
                                                    <Tag
                                                        color={returnLoyaltyTier(loyaltyTier)}
                                                    >
                                                        {loyaltyTier}
                                                    </Tag>
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row className='mb-2'>
                                            <Col xs={12} sm={12} md={12}>
                                                <Icon
                                                    type={LinkOutlined}
                                                    className='text-primary font-size-md'
                                                />
                                                <span className='text-muted ml-2'>Lifecycle:</span>
                                            </Col>
                                            <Col xs={12} sm={12} md={12}>
                                                <span className='font-weight-semibold'>
                                                    {`${moment().diff(moment(user?.CreationDate), "day")} days`}
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row className='mb-2'>
                                            <Col xs={12} sm={12} md={12}>
                                                <Icon
                                                    type={LinkOutlined}
                                                    className='text-primary font-size-md'
                                                />
                                                <span className='text-muted ml-2'>Account Officer:</span>
                                            </Col>
                                            <Col xs={12} sm={12} md={12}>

                                            </Col>
                                        </Row>
                                        <Row className='mb-2'>
                                            <Col xs={12} sm={12} md={12}>
                                                <Icon
                                                    type={LinkOutlined}
                                                    className='text-primary font-size-md'
                                                />
                                                <span className='text-muted ml-2'>Interest:</span>
                                            </Col>
                                            <Col xs={12} sm={12} md={12}>
                                                <span>{profileUpdates[0]?.description || ""}</span>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Tabs
                    defaultActiveKey={active}
                    style={{ marginTop: 30, marginBottom: -36 }}
                    onTabClick={(key) => setActive(key)}
                    items={items}
                />
            </Card>
        </>
    );

    const General = (
        <Card hidden={active !== 'general'}>
            <Divider
                orientation='left'
                style={{ color: '#333', fontWeight: 'normal' }}
            >
                Personal Information
            </Divider>
            <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                <Col className='gutter-row' span={6}>
                    <p>CUSTOMER NO</p>
                    <span className='font-weight-semibold'>{user?.CustomerNo || customer?.CustomerNo}</span>
                </Col>
                <Col className='gutter-row' span={6}>
                    <p>FULL NAME</p>
                    <span className='font-weight-semibold'>{user?.Name || customer?.Name}</span>
                </Col>
                <Col className='gutter-row' span={6}>
                    <p>PHONE NUMBER</p>
                    <span className='font-weight-semibold'>{user?.Mobile || customer?.Mobile}</span>
                </Col>
                <Col className='gutter-row' span={6}>
                    <p>EMAIL ADDRESS</p>
                    <span className='font-weight-semibold'>{user?.Email || customer?.Email}</span>
                </Col>
                <Col className='gutter-row' span={6}>
                    <p>BirthDate</p>
                    <span className='font-weight-semibold'>{moment
                        .parseZone(user?.BirthDate || customer?.BirthDate)
                        .format('MMM, Do YYYY')}</span>
                </Col>
                <Col className='gutter-row' span={6}>
                    <p>CREATED BY</p>
                    <span className='font-weight-semibold'>{user?.CreatedBy || customer?.CreatedBy}</span>
                </Col>
                <Col className='gutter-row' span={6}>
                    <p>ADDRESS</p>
                    <span className='font-weight-semibold'>{user?.MainAddress || customer?.MainAddress}</span>
                </Col>
            </Row>
        </Card>
    );

    const Tickets = (
        <>
            {active_com === 'tickets' && active === "communications" ?
                <Card>
                    <div className='table-responsive'>
                        <Table
                            columns={[
                                { title: 'ID', dataIndex: 'id' },
                                { title: 'Type', dataIndex: 'type' },
                                {
                                    title: 'Subject',
                                    dataIndex: 'subject',
                                    render: (_, record) => <span>{record.subject}</span>,
                                },
                                {
                                    title: 'Date Sent',
                                    dataIndex: 'created_on',
                                    render: (_, record) => (
                                        <span>
                                            {moment
                                                .parseZone(record.created_on)
                                                .format('MMM, Do YYYY, hh:mm A')}
                                        </span>
                                    ),
                                    sorter: true,
                                },
                                {
                                    title: 'Due Date',
                                    dataIndex: 'due_by',
                                    render: (_, record) => (
                                        <span>
                                            {moment
                                                .parseZone(record.due_by)
                                                .format('MMM, Do YYYY, hh:mm A')}
                                        </span>
                                    ),
                                    sorter: true,
                                },
                                {
                                    title: 'Source',
                                    dataIndex: 'source',
                                    render: (_, record) => (
                                        <span>
                                            {returnSource(record?.source)}
                                        </span>
                                    ),
                                    sorter: true,
                                },
                                {
                                    title: 'Status',
                                    dataIndex: 'status',
                                    render: (_, record) => (
                                        <span>
                                            {`${returnTicketStatus(record?.status)}`}
                                        </span>
                                    ),
                                },
                                {
                                    title: 'Details',
                                    dataIndex: 'action',
                                    render: (_, record) => (<>
                                        <span title="View ticket" style={{ cursor: 'pointer', color: 'green' }} onClick={() => history.push(`/tickets/details/${record.id}`)}><EyeOutlined /></span></>),
                                },
                                {
                                    title: 'Notes',
                                    dataIndex: 'action',
                                    render: (_, record) => (<>
                                        <span style={{ cursor: 'pointer', color: 'green' }} onClick={() => setNotes(record)}><MessageOutlined /></span></>),
                                },
                            ]}
                            dataSource={tickets}
                            rowKey='id'
                            rowSelection={false}
                            loading={loading}
                            style={{ cursor: 'pointer' }}
                            pagination={false}
                        />
                    </div>
                </Card>
                : ""}
        </>
    );

    const getDaysRenewal = (date1, date2) => {
        const dateB = moment(date2);
        const dateC = moment();

        let days = dateB.diff(dateC, 'days');
        if (days < 0) days = 0;
        return `${days} day(s)`;
    }

    const ComplainTickets = (
        <Card hidden={active !== 'complains'}>
            <div className='table-responsive'>
                <Table
                    columns={[
                        { title: 'ID', dataIndex: 'id' },
                        { title: 'Type', dataIndex: 'type' },
                        {
                            title: 'Subject',
                            dataIndex: 'subject',
                            render: (_, record) => <span>{record.subject}</span>,
                        },
                        {
                            title: 'Date Sent',
                            dataIndex: 'created_on',
                            render: (_, record) => (
                                <span>
                                    {moment
                                        .parseZone(record.created_on)
                                        .format('MMM, Do YYYY, hh:mm A')}
                                </span>
                            ),
                            sorter: true,
                        },
                        {
                            title: 'Due Date',
                            dataIndex: 'due_by',
                            render: (_, record) => (
                                <span>
                                    {moment
                                        .parseZone(record.due_by)
                                        .format('MMM, Do YYYY, hh:mm A')}
                                </span>
                            ),
                            sorter: true,
                        },
                        {
                            title: 'Source',
                            dataIndex: 'source',
                            render: (_, record) => (
                                <span>
                                    {returnSource(record?.source)}
                                </span>
                            ),
                            sorter: true,
                        },
                        {
                            title: 'Status',
                            dataIndex: 'status',
                            render: (_, record) => (
                                <span>
                                    {record?.status === 2
                                        ? 'Open'
                                        : record?.status === 3
                                            ? 'Pending'
                                            : record?.status === 4
                                                ? 'Resolved'
                                                : record?.status === 5
                                                    ? 'Closed'
                                                    : ''}
                                </span>
                            ),
                        },
                    ]}
                    dataSource={complains}
                    rowKey='id'
                    loading={loading}
                    rowSelection={false}
                    style={{ cursor: 'pointer' }}
                    pagination={false}
                />
            </div>
        </Card>
    );

    const Policy = (
        <Card hidden={active !== 'policy'}>
            <div className='table-responsive'>
                <Table
                    columns={[
                        {
                            title: 'Policy Number',
                            dataIndex: 'paid',
                            render: (_, record) => <span>{record?.PolicyList?.SegmentCode || record?.SEGMENT_CODE}</span>,
                        },
                        {
                            title: 'Policy Class',
                            dataIndex: 'className',
                            render: (_, record) => <span>{record?.PolicyList?.className || "None"}</span>,
                        },
                        {
                            title: 'Policy Name',
                            dataIndex: 'paid',
                            render: (_, record) => <span>{record?.PolicyList?.PolicyTypeName || record?.PLAN_NAME}</span>,
                        },
                        {
                            title: 'Source of Business',
                            dataIndex: 'source',
                            render: (_, record) => <span>{record?.PolicyList?.source || record?.source}</span>,
                        },
                        {
                            title: 'Premium',
                            dataIndex: 'paid',
                            render: (_, record) => <span>{Number(record?.PolicyList?.NetPremium || record?.PERIODIC_PREMIUM_LC || 0).toLocaleString()}</span>,
                        },
                        {
                            title: 'Tenor',
                            dataIndex: 'tenor',
                            render: (_, record) => <span>
                                {`${record?.POLICY_DURATION || 1}year(s)`}
                            </span>
                        },
                        {
                            title: 'EffectiveDate',
                            dataIndex: 'paid',
                            render: (_, record) => (
                                <span>
                                    {moment
                                        .parseZone(record?.PolicyList?.EffectiveDate || record?.EFFECTIVE_DATE)
                                        .format('MMM, Do YYYY')}
                                </span>
                            ),
                        },
                        {
                            title: 'ExpiryDate',
                            dataIndex: 'paid',
                            render: (_, record) => (
                                <span>
                                    {moment.parseZone(record?.PolicyList?.ExpiryDate || record?.EXPIRY_DATE).format('MMM, Do YYYY')}
                                </span>
                            ),
                        },
                        {
                            title: 'Account Officer',
                            dataIndex: 'account_officer',
                            render: (_, record) => (
                                <span>
                                    {((record?.PolicyList?.StaffName || record?.PolicyList?.AgentName) || record?.AgentName)}
                                </span>
                            ),
                        },
                        {
                            title: 'Account Officer Number',
                            dataIndex: 'account_officer',
                            render: (_, record) => (
                                <span>
                                    {(record?.PolicyList?.AgentPhoneNumber || record?.AgentPhoneNumber)}
                                </span>
                            ),
                        },
                        {
                            title: 'Next Renewal',
                            dataIndex: 'days_renewal',
                            render: (_, record) => (
                                <span>
                                    {(user?.CompanyId || customer?.CompanyId) === 1 ? getDaysRenewal(record?.PolicyList?.EffectiveDate, record?.PolicyList?.ExpiryDate) : moment().add(1, 'M').startOf('month').format('YYYY-MM-DD')}
                                </span>
                            ),
                        },
                        {
                            title: 'Pay Frequency',
                            dataIndex: 'pay_frequency',
                            render: (_, record) => (
                                <span>
                                    {record?.PAYMENT_CYCLE_NAME || "Yearly"}
                                </span>
                            ),
                        },
                        {
                            title: 'Status',
                            dataIndex: 'status',
                            render: (_, record) => <span>{moment(record?.PolicyList?.ExpiryDate || record?.EXPIRY_DATE).isAfter(new Date()) ? "Active" : "Expired"}</span>,
                        },
                        {
                            title: '',
                            dataIndex: 'actions',
                            render: (_, elm) => (
                                <div className='text-right' onClick={(e) => e.stopPropagation()}>
                                    <EllipsisDropdown menu={dropdownMenu(elm)} />
                                </div>
                            ),
                        },
                    ]}
                    dataSource={policy}
                    rowKey='id'
                    loading={loading}
                    rowSelection={false}
                    style={{ cursor: 'pointer' }}
                />
            </div>
        </Card>
    );

    const Claims = (
        <Card hidden={active !== 'claims'}>
            <div className='table-responsive'>
                {user?.CompanyId === 1 ?
                    <Table
                        columns={[
                            {
                                title: 'Policy Number',
                                dataIndex: 'policyNumber',
                                render: (_, record) => <span>{record?.policyNumber}</span>,
                            },
                            { title: 'ClaimNO', dataIndex: 'SegmentCode' },
                            {
                                title: 'Year',
                                dataIndex: 'ClaimYear',
                                render: (_, record) => <span>{record?.ClaimYear}</span>,
                            },
                            {
                                title: 'Description',
                                dataIndex: 'Description',
                                render: (_, record) => <span>{record?.Description}</span>,
                            },
                            {
                                title: 'Registration Date',
                                dataIndex: 'RegistrationDate',
                                render: (_, record) => (
                                    <span>
                                        {moment
                                            .parseZone(record?.RegistrationDate)
                                            .format('MMM, Do YYYY')}
                                    </span>
                                ),
                            },
                            {
                                title: 'CreationDate',
                                dataIndex: 'CreationDate',
                                render: (_, record) => (
                                    <span>
                                        {moment
                                            .parseZone(record?.CreationDate)
                                            .format('MMM, Do YYYY')}
                                    </span>
                                ),
                            },
                            {
                                title: 'CreatedBy',
                                dataIndex: 'CreatedBy',
                                render: (_, record) => <span>{record?.CreatedBy}</span>,
                            },
                            {
                                title: 'Status',
                                dataIndex: 'status',
                                render: (_, record) => <span>{returnClaimSource(record?.ClaimStatus)}</span>,
                            },
                            // {
                            //   title: 'View',
                            //   dataIndex: 'action',
                            //   render: (_, record) => (<>
                            //     <span title="View claim" style={{ cursor: 'pointer', color: 'green' }} onClick={() => viewClaim(record)}><EyeOutlined /></span></>)
                            // }
                        ]}
                        dataSource={claims}
                        rowKey='id'
                        loading={loading}
                        rowSelection={false}
                        style={{ cursor: 'pointer' }}
                    /> :
                    <Table
                        columns={[
                            {
                                title: 'Policy Number',
                                dataIndex: 'policyNumber',
                                render: (_, record) => <span>{record?.policyNumber}</span>,
                            },
                            {
                                title: 'Policy Name',
                                dataIndex: 'policyName',
                                render: (_, record) => <span>{record?.policyName}</span>,
                            },
                            {
                                title: 'Nature of Claim',
                                dataIndex: 'claimType',
                                render: (_, record) => <span>{record?.claimType}</span>,
                            },
                            {
                                title: 'Reason',
                                dataIndex: 'reason',
                                render: (_, record) => <span>{record?.reason || record?.description}</span>,
                            },
                            {
                                title: 'Status',
                                dataIndex: 'status',
                                render: (_, record) => (
                                    <span>
                                        {record?.status}
                                    </span>
                                ),
                            },
                            {
                                title: 'Trans.Date',
                                dataIndex: 'dateOfIncident',
                                render: (_, record) => (
                                    <span>
                                        {moment(record?.dateOfIncident).format("YYYY-MM-DD")}
                                    </span>
                                ),
                            }
                        ]}
                        dataSource={claims}
                        rowKey='_id'
                        loading={loading}
                        rowSelection={false}
                        style={{ cursor: 'pointer' }}
                    />}
            </div>
        </Card>
    );

    const Documents = (
        <Card hidden={active !== 'documents'}>
            <div className='table-responsive'>
                <Table
                    columns={[
                        { title: 'ID', dataIndex: '_id' },
                        {
                            title: 'Name',
                            dataIndex: 'documentLink',
                            render: (_, record) => <span>{record?.documentLink.split('customerdocuments/')[1].replace(".pdf", "")}</span>,
                        },
                        {
                            title: 'Created On',
                            dataIndex: 'documentLink',
                            render: (_, record) => <span>{moment(record?.entryDate).format("YYYY-MM-DD")}</span>,
                        },
                        {
                            title: 'View',
                            dataIndex: 'action',
                            render: (_, record) => (<>
                                <span title="View document" style={{ cursor: 'pointer', color: 'green' }} onClick={() => ViewDocuments(record?.documentLink)}><EyeOutlined /></span></>),
                        },
                        {
                            title: 'Mail',
                            dataIndex: 'action',
                            render: (_, record) => (<>
                                <span title="Send document" style={{ cursor: 'pointer', color: 'green' }} onClick={() => sendDocumentMail(record?.documentLink)}><MailOutlined /></span></>),
                        }
                    ]}
                    dataSource={documents}
                    rowKey='id'
                    loading={loading}
                    rowSelection={false}
                    style={{ cursor: 'pointer' }}
                />
            </div>
        </Card>
    );

    const getStatements = async (record) => {
        localStorage.setItem(`statement-${record?.policyNo}`, JSON.stringify(record));
        window.open(`statement.html?id=${record?.policyNo}`, '_blank', 'noopener,noreferrer');
    }

    const AllStatements = (
        <Card hidden={active !== 'statements'}>
            <div className='table-responsive'>
                <Table
                    columns={[
                        { title: 'ID', dataIndex: 'policyNo' },
                        {
                            title: 'Name',
                            dataIndex: 'productName',
                            render: (_, record) => <span>{record?.productName}</span>,
                        },
                        {
                            title: 'Premium',
                            dataIndex: 'premium',
                            render: (_, record) => <span>{Number(record?.premium || 0).toLocaleString()}</span>,
                        },
                        {
                            title: 'Premium Amount',
                            dataIndex: 'premiumAmount',
                            render: (_, record) => <span>{Number(record?.premiumAmount || 0).toLocaleString()}</span>,
                        },
                        {
                            title: 'Frequency',
                            dataIndex: 'PremiumFrequency',
                            render: (_, record) => <span>{record?.PremiumFrequency}</span>,
                        },
                        {
                            title: 'Position',
                            dataIndex: 'PremiumPosition',
                            render: (_, record) => <span>{record?.PremiumPosition}</span>,
                        },
                        {
                            title: 'Effective Date',
                            dataIndex: 'effectiveDate',
                            render: (_, record) => <span>{record?.effectiveDate}</span>,
                        },
                        {
                            title: 'Expiry Date',
                            dataIndex: 'expiryDate',
                            render: (_, record) => <span>{record?.expiryDate}</span>,
                        },
                        {
                            title: 'View',
                            dataIndex: 'action',
                            render: (_, record) => (<>
                                <span title="View Record" style={{ cursor: 'pointer', color: 'green' }} onClick={() => getStatements(record)}><EyeOutlined /></span></>),
                        }
                    ]}
                    dataSource={allstatement}
                    rowKey='id'
                    loading={loading}
                    rowSelection={false}
                    style={{ cursor: 'pointer' }}
                />
            </div>
        </Card>
    );

    const Communication = (
        <Card hidden={active !== 'communications'}>
            <div className='table-responsive'>
                <Tabs
                    defaultActiveKey={active_com}
                    style={{ marginTop: 30, marginBottom: -36 }}
                    onTabClick={(key) => setActiveCom(key)}
                    items={items_communications}
                />
            </div>
        </Card>
    );

    const EmailCommunication = (
        <>
            {active_com === 'email' && active === "communications" ?
                <Card>

                    <div className='table-responsive'>
                        <Table
                            columns={[
                                {
                                    title: 'Sender',
                                    dataIndex: 'sender',
                                    render: (_, record) => <span>{record?.sender}</span>,
                                },
                                {
                                    title: 'Subject',
                                    dataIndex: 'subject',
                                    render: (_, record) => <span>{record?.subject}</span>,
                                },
                                {
                                    title: 'Date',
                                    dataIndex: 'date',
                                    render: (_, record) => <span>{moment(record?.date).format('DD-MM-YYYY')}</span>,
                                },
                                {
                                    title: 'View',
                                    dataIndex: 'action',
                                    render: (_, record) => (<>
                                        <span title="View mail" style={{ cursor: 'pointer', color: 'green' }} onClick={() => setFile(record)}><EyeOutlined /></span></>),
                                }
                            ]}
                            dataSource={email}
                            rowKey='id'
                            rowSelection={false}
                            loading={loading}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                </Card>
                : ""}
        </>
    );

    const SMSCommunication = (
        <>
            {active_com === 'sms' && active === "communications" ?
                <Card hidden={active_com !== 'sms'}>

                    <div className='table-responsive'>
                        <Table
                            columns={[
                                {
                                    title: 'Message',
                                    dataIndex: 'message',
                                    render: (_, record) => <span>{record?.message}</span>,
                                },
                                {
                                    title: 'Date',
                                    dataIndex: 'date',
                                    render: (_, record) => <span>{moment(record?.date).format('DD-MM-YYYY')}</span>,
                                },
                            ]}
                            dataSource={sms}
                            rowKey='id'
                            rowSelection={false}
                            loading={loading}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                </Card>
                : ""}
        </>
    );

    const PhoneCommunication = (
        <>
            {active_com === 'phone' && active === "communications" ?
                <Card hidden={active_com !== 'phone'}>

                    <div className='table-responsive'>
                        <Table
                            columns={[
                                {
                                    title: 'CallerNumber',
                                    dataIndex: 'CallerNumber',
                                },
                                {
                                    title: 'StartTime',
                                    dataIndex: 'StartTime',
                                    render: (_, record) => <div>{moment(record?.StartTime).format("YYYY-MM-DD hh:mm:ss A")}</div>,
                                },
                                {
                                    title: 'AnswerTime',
                                    dataIndex: 'AnswerTime',
                                    render: (_, record) => <div>{moment(record?.AnswerTime).format("YYYY-MM-DD hh:mm:ss A")}</div>,
                                },
                                {
                                    title: 'EndTime',
                                    dataIndex: 'EndTime',
                                    render: (_, record) => <div>{moment(record?.EndTime).format("YYYY-MM-DD hh:mm:ss A")}</div>,
                                },
                                {
                                    title: 'Disposition',
                                    dataIndex: 'Disposition',
                                    render: (_, record) => <div>{record?.Disposition}</div>,
                                },
                                {
                                    title: 'LogUserfield',
                                    dataIndex: 'LogUserfield',
                                    render: (_, record) => <div>{record?.LogUserfield}</div>,
                                }
                            ]}
                            dataSource={phone}
                            rowKey='id'
                            rowSelection={false}
                            loading={loading}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                </Card>
                : ""}
        </>
    );

    const ProfileUpdates = (
        <Card hidden={active !== 'profile_updates'}>
            <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                <Flex className="mb-1" mobileFlex={false}>
                    <div className="mr-md-3 mb-3">
                    </div>
                </Flex>
                <div>
                    <Button onClick={() => setProfile({ user_id: customer?.ID, company_id: user?.CompanyId })} type="primary" >Add Note</Button>
                </div>
            </Flex>
            <div className='table-responsive'>

                <Table
                    columns={[
                        { title: 'ID', dataIndex: 'id' },
                        {
                            title: 'Record',
                            dataIndex: 'description',
                            render: (_, record) => <span>{record?.description}</span>,
                        },
                        {
                            title: 'Created By',
                            dataIndex: 'created_by',
                            render: (_, record) => <span>{record?.created_by}</span>,
                        },
                        {
                            title: 'Created On',
                            dataIndex: 'created_on',
                            render: (_, record) => <span>{moment(record?.created_on).format('YYYY-MM-DD')}</span>,
                        },
                        {
                            title: '',
                            dataIndex: 'created_on',
                            render: (_, record) => <span>{record?.created_by === `${localStorage.getItem("CRM_StaffName")}` ? <Popconfirm
                                placement="right"
                                title={"Are you sure you want to delete this statement?"}
                                onConfirm={() => deleteProfileUpdate(record.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button size="small" danger icon={<DeleteOutlined />} />
                            </Popconfirm> : ''}</span>,
                        },

                    ]}
                    dataSource={profileUpdates}
                    rowKey='id'
                    loading={loading}
                    rowSelection={false}
                    style={{ cursor: 'pointer' }}
                />
            </div>
        </Card>
    );

    const CustomerRating = (
        <Card hidden={active !== 'customer_rating'}>
            <div className='table-responsive'>
                <Tabs
                    defaultActiveKey={active_rating}
                    style={{ marginTop: 30, marginBottom: -36 }}
                    onTabClick={(key) => setRatingCom(key)}
                    items={items_customer_rating}
                />
            </div>
        </Card>
    );

    const SatisfactorySurvey = (
        <>
            {active_rating === 'satisfactory_survey' && active === "customer_rating" ?
                <Card hidden={active_rating !== 'satisfactory_survey'}>

                    <div className='table-responsive'>
                        <Table
                            columns={[
                                {
                                    title: 'Product',
                                    dataIndex: 'productOwn',
                                },
                                {
                                    title: 'Rating',
                                    dataIndex: 'satisfactoryRating',
                                },
                                {
                                    title: 'Reason',
                                    dataIndex: 'satisfactoryReason'
                                },
                                {
                                    title: 'Channel',
                                    dataIndex: 'engagementChannel'
                                },
                                {
                                    title: 'Channel Rating',
                                    dataIndex: 'engagementChannelRating'
                                },
                                {
                                    title: 'Experience Rating',
                                    dataIndex: 'interactionExperienceRating'
                                },
                                {
                                    title: 'Rate Impression',
                                    dataIndex: 'rateImpression'
                                },
                                {
                                    title: 'Meaning',
                                    dataIndex: 'meaning'
                                },
                                {
                                    title: 'Date',
                                    dataIndex: 'date',
                                    render: (_, record) => <div>{moment(record?.date).format("YYYY-MM-DD hh:mm:ss A")}</div>,
                                }

                            ]}
                            dataSource={satisfactorySurvey}
                            rowSelection={false}
                            loading={loading}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                </Card>
                : ""}
        </>
    );

    const ExperienceEffortSurvey = (
        <>
            {active_rating === 'experience_effort_survey' && active === "customer_rating" ?
                <Card hidden={active_rating !== 'experience_effort_survey'}>

                    <div className='table-responsive'>
                        <Table
                            columns={[
                                {
                                    title: 'Channel',
                                    dataIndex: 'engagementChannel',
                                },
                                {
                                    title: 'Claim Rating',
                                    dataIndex: 'claimRating',
                                },
                                {
                                    title: 'Claim Reason',
                                    dataIndex: 'claimReason'
                                },
                                {
                                    title: 'Module',
                                    dataIndex: 'module'
                                },
                                {
                                    title: 'Rate Impression',
                                    dataIndex: 'rateImpression'
                                },
                                {
                                    title: 'Date',
                                    dataIndex: 'date',
                                    render: (_, record) => <div>{moment(record?.date).format("YYYY-MM-DD hh:mm:ss A")}</div>,
                                }

                            ]}
                            dataSource={experienceEffortSurvey}
                            rowSelection={false}
                            loading={loading}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                </Card>
                : ""}
        </>
    );

    const NetPerformanceSurvey = (
        <>
            {active_rating === 'net_performance_survey' && active === "customer_rating" ?
                <Card hidden={active_rating !== 'net_performance_survey'}>

                    <div className='table-responsive'>
                        <Table
                            columns={[
                                {
                                    title: 'Channel',
                                    dataIndex: 'engagementChannel',
                                },
                                // {
                                //     title: 'Score',
                                //     dataIndex: 'recommendScore',
                                // },
                                // {
                                //     title: 'Reason',
                                //     dataIndex: 'recommendReason'
                                // },
                                {
                                    title: 'Impression',
                                    dataIndex: 'rateImpression'
                                },
                                {
                                    title: 'Meaning',
                                    dataIndex: 'meaning'
                                },
                                {
                                    title: 'Date',
                                    dataIndex: 'date',
                                    render: (_, record) => <div>{moment(record?.date).format("YYYY-MM-DD hh:mm:ss A")}</div>,
                                }

                            ]}
                            dataSource={netPerformanceSurvey}
                            rowKey='id'
                            rowSelection={false}
                            loading={loading}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                </Card>
                : ""}
        </>
    );

    return (
        <>
            <div className='container my-4'>
                {ProfileInfo}
                {General}
                {Documents}
                {Policy}
                {Claims}
                {ComplainTickets}
                {AllStatements}
                {Communication}
                {EmailCommunication}
                {SMSCommunication}
                {PhoneCommunication}
                {Tickets}
                {ProfileUpdates}
                {CustomerRating}
                {SatisfactorySurvey}
                {ExperienceEffortSurvey}
                {NetPerformanceSurvey}
            </div>
            <StatementModel
                initialValues={statement}
                onClose={() => setStatement()} />
            <CancellationModal
                initialValues={cancellation}
                onClose={() => setCancellation([])} />
            <FileModel
                initialValues={file}
                onClose={() => setFile()} />
            <ViewDocumentModal
                initialValues={viewDocument}
                onClose={() => setViewDocument()} />
            <MissedPremiumModal
                initialValues={missed}
                onClose={() => setMissed([])} />
            <ProfileUpdateModal
                initialValues={profile}
                onFinish={() => fetchProfileUpdate()}
                onClose={() => setProfile()} />
            <NotesModal
                initialValues={notes}
                onClose={() => setNotes()}
            />
            <Modal
                title="Customer Data"
                cancelButtonProps={{ style: { display: 'none' } }}
                centered
                style={{ top: 20 }}
                open={modal1Open}
                onOk={() => setModal1Open(false)}
            >
                <p><b>Mobile Number</b> - {customer?.Mobile?.toString().trim() === "" && customer?.Phone?.toString().trim() === "" ? <Tag color={getStatus("not")}>{`Not Avaliable`}</Tag> : <Tag color={getStatus("success")}>{`Avaliable`}</Tag>}</p>
                <p><b>Email Address</b> - {customer?.Email?.toString().trim() === "" ? <Tag color={getStatus("not")}>{`Not Avaliable`}</Tag> : <Tag color={getStatus("success")}>{`Avaliable`}</Tag>}</p>
                <p><b>Address</b> - {customer?.MainAddress?.toString().trim() === "" ? <Tag color={getStatus("not")}>{`Not Avaliable`}</Tag> : <Tag color={getStatus("success")}>{`Avaliable`}</Tag>}</p>
            </Modal>
        </>
    );
};

export default User;
