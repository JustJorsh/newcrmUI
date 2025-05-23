import React, { useEffect, useState } from 'react';
import moment from 'moment';
import ChartWidget from 'components/shared-components/ChartWidget';
import AxiosClient from 'services/AxiosClient';
import Loading from 'components/shared-components/Loading';

const YearReport = ({ CN, CNFK }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);


  const getReport = async () => {
    setLoading(true);
    try {
      const client = await AxiosClient();
      const response = await client.get(`dashboard/expense/year/${CNFK}/claims`);
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
        { name: `Yearly Claims Payments ${CN}`, data: reports?.map((r) => r.totalamount) },
      ]}
      xAxis={reports?.map((r) => `${r.year}`)}
      height={250}
      title={`Yearly Claims Payments ${CN}`}
      type='bar'
    />
  );
};

export default YearReport;
