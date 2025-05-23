import React, { useEffect, useState } from 'react';
import moment from 'moment';
import ChartWidget from 'components/shared-components/ChartWidget';
import AxiosClient from 'services/AxiosClient';
import Loading from 'components/shared-components/Loading';

const GeneralPolicyReport = ({ year }) => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);

    const getReport = async () => {
        setLoading(true);
        try {
            const client = await AxiosClient();
            const response = await client.get('customers/general_policies_count_per_month');
            const res = response?.data?.data?.data;
            if (res.length > 0) {
                const reportsData = res.filter(x => x?.year == year);
                let user = [];
                reportsData.forEach(element => {
                    user.push({ ...element, mnth: getMonth(element?.month) });
                });
                setReports(user);
            }
        } catch (error) {
            setReports([]);
        }
        setLoading(false);
    };

    const getMonth = (month) => {
        if (month == 1)
            return "Jan";
        if (month == 2)
            return "Feb";
        if (month == 3)
            return "March";
        if (month == 4)
            return "Apr";
        if (month == 5)
            return "May";
        if (month == 6)
            return "June";
        if (month == 7)
            return "July";
        if (month == 8)
            return "August";
        if (month == 10)
            return "Oct";
        if (month == 9)
            return "Sept";
        if (month == 11)
            return "Nov";
        if (month == 12)
            return "Dec";
    }
    useEffect(() => {
        try {
            getReport();
        }
        catch (error) {
            console.log(error);
        }
    }, [year]);

    return loading ? (
        <div
            style={{ minHeight: '200px', marginTop: '40px', marginBottom: '40px' }}>
            <Loading cover='content' />
        </div>
    ) : (
        <ChartWidget
            card
            series={[
                { name: 'HGI', data: reports?.map((r) => r.HIL) },
            ]}
            xAxis={reports?.map((r) => `${r.mnth}`)}
            height={250}
            title={'General Policy'}
            type='line'
        />
    );
};

export default GeneralPolicyReport;
