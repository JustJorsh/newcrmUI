import React, { useEffect, useState } from 'react';
import moment from 'moment';
import ChartWidget from 'components/shared-components/ChartWidget';
import AxiosClient from 'services/AxiosClient';
import Loading from 'components/shared-components/Loading';

const ActivityReport = ({ propReport }) => {
  const [reports, setReports] = useState(propReport);
  const [loading, setLoading] = useState(false);


  const getReport = async () => {
    setLoading(true);
    try {
      const client = await AxiosClient();
      const response = await client.get('dashboard/freshdesk/date');
      setReports(response.data.data?.slice(0, 12));
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
        { name: 'Freshdesk Activity', data: reports?.map((r) => r.count) },
      ]}
      xAxis={reports?.map((r) => `${r.date}`)}
      height={250}
      title={'Freshdesk Activity'}
      type='bar'
    />
  );
};

export default ActivityReport;
