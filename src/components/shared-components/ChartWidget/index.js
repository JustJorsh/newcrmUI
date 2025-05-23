import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import ApexChart from "react-apexcharts";
import {
  apexLineChartDefaultOption,
  apexBarChartDefaultOption,
  apexAreaChartDefaultOption
} from 'constants/ChartConstant';
import { useResizeDetector } from 'react-resize-detector';

const titleStyle = {
  position: 'relative',
  zIndex: '1'
};

const extraStyle = {
  position: 'absolute',
  zIndex: '1',
  right: '0',
  top: '-2px'
};

const getChartTypeDefaultOption = type => {
  switch (type) {
    case 'line':
      return apexLineChartDefaultOption;
    case 'bar':
      return apexBarChartDefaultOption;
    case 'area':
      return apexAreaChartDefaultOption;
    default:
      return apexLineChartDefaultOption;
  }
};

const ChartWidget = ({ title, series, width, height, xAxis, customOptions, card, type, extra }) => {
  let options = getChartTypeDefaultOption(type);
  const isMobile = window.innerWidth < 768;

  const chartRef = useRef();
  const extraRef = useRef();

  const setLegendOffset = () => {
    if (chartRef.current) {
      const legend = chartRef.current.querySelector('div.apexcharts-legend');
      if (legend) {
        legend.style.marginRight = `${isMobile ? 0 : extraRef.current?.offsetWidth || 0}px`;
        if (isMobile) {
          legend.style.position = 'relative';
          legend.style.top = 0;
          legend.style.justifyContent = 'start';
          legend.style.padding = 0;
        }
      }
    }
  };

  useEffect(() => {
    setLegendOffset();
  }, []);

  const onResize = () => {
    setTimeout(() => {
      setLegendOffset();
    }, 600);
  };

  const { ref } = useResizeDetector({ onResize });

  options.xaxis.categories = xAxis;
  if (customOptions) {
    options = { ...options, ...customOptions };
  }

  const renderChart = (
    <div ref={ref}>
      <div className="chartRef" ref={chartRef}>
        <ApexChart options={options} type={type} series={series} width={width} height={height} />
      </div>
    </div>
  );

  return (
    <>
      {card ? (
        <Card>
          <div className="position-relative">
            {title && (
              <h4 className="font-weight-bold" style={!isMobile ? titleStyle : {}}>
                {title}
              </h4>
            )}
            {extra && <div ref={extraRef} style={!isMobile ? extraStyle : {}}>{extra}</div>}
            {renderChart}
          </div>
        </Card>
      ) : (
        renderChart
      )}
    </>
  );
};

ChartWidget.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  series: PropTypes.array.isRequired,
  xAxis: PropTypes.array,
  customOptions: PropTypes.object,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  card: PropTypes.bool,
  type: PropTypes.string,
  extra: PropTypes.node,
};

ChartWidget.defaultProps = {
  series: [],
  height: 300,
  width: '100%',
  card: true,
  type: 'line',
};

export default ChartWidget;
