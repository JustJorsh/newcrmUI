import React, { useEffect, useState } from 'react';
import moment from 'moment';
import ChartWidget from 'components/shared-components/ChartWidget';
import AxiosClient from 'services/AxiosClient';
import Loading from 'components/shared-components/Loading';

const MonthReport = ({ CN, CNFK, YEAR }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);


  const getReport = async () => {
    setLoading(true);
    try {
      const client = await AxiosClient();
      const response = await client.get(`dashboard/expense/month/${CNFK}/claims?year=${YEAR}`);
      console.log(response?.data);
      setReports(response.data?.data.slice(0, 12));
    } catch (error) {
      setReports([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    try {
      getReport();
    }
    catch (error) {
      console.log(error);
    }
  }, []);

  return loading ? (
    <div
      style={{ minHeight: '200px', marginTop: '40px', marginBottom: '40px' }}
    >
      <Loading cover='content' />
    </div>
  ) : (
    <ChartWidget
      card
      series={[
        { name: `Claims Payments ${CN}`, data: reports?.map((r) => r.totalamount) },
      ]}
      xAxis={reports?.map((r) => `${r.month}`)}
      height={250}
      title={`${YEAR} Monthly Claims Payments ${CN}`}
      type='bar'
    />
  );
};

export default MonthReport;
