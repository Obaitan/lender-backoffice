import Link from 'next/link';
import { Tooltip, PieChart, Pie, Cell } from 'recharts';

type PieTooltipPayload = {
  name: string;
  value: number;
};

// Define custom tooltip props interface
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

// Default data to use if API data is not available
const defaultRequestsData = [
  { name: 'Account Statement', value: 1 },
  { name: 'Loan Top Up', value: 1 },
  { name: 'Loan Restructuring', value: 1 },
  { name: 'Information Update', value: 1 },
  { name: 'Other Issues', value: 1 },
];

// Color palette for pie chart
const COLORS = ['#1E3A8A', '#D6E4ED', '#3faad7', '#daf7fb', '#01b4cb'];

// Custom Tooltip for the pie chart
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0] as PieTooltipPayload; // Type assertion
    return (
      <div className="bg-white p-2 shadow-md rounded-md text-sm">
        <p className="text-gray-700 font-medium">{data.name}</p>
        <p className="text-gray-500">Value: {data.value}</p>
      </div>
    );
  }
  return null;
};

interface CustomerRequestCount {
  requestType: string;
  count: number;
}

// Process API data to format needed for the pie chart
const processApiData = (apiData: CustomerRequestCount[] | undefined) => {
  if (!apiData || apiData.length === 0) {
    return defaultRequestsData;
  }

  // Map API data to the format needed for the pie chart
  return apiData.map((item) => ({
    name: item.requestType || 'Unknown',
    value: item.count || 0,
  }));
};

interface PieChartProps {
  customData?: CustomerRequestCount[];
}

export default function PieChartComponent({ customData }: PieChartProps) {
  // Process the API data or use default data
  const requestsData = processApiData(customData);

  return (
    <div className="xl:px-2">
      <Link
        href={'/requests'}
        className="text-secondary-200 font-medium lg:ml-7 mb-3 inline-block"
      >
        Customer Requests
      </Link>
      <PieChart width={375} height={275}>
        <Pie
          data={requestsData}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={88}
          fill="#8884d8"
          dataKey="value"
          label={({ name, value, midAngle, cx, cy }) => {
            const RADIAN = Math.PI / 180;
            const radius = 112; // Position outside the pie
            const x = cx + radius * Math.cos(-(midAngle || 0) * RADIAN);
            const y = cy + radius * Math.sin(-(midAngle || 0) * RADIAN);
            return (
              <text
                x={x}
                y={y}
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize="13px"
                fontWeight="400"
              >
                <tspan x={x} dy="-0.4em" fill="#FF8C42">
                  {name}
                </tspan>
                <tspan x={x} dy="1.2em" fill="#667185">
                  {value}
                </tspan>
              </text>
            );
          }}
        >
          {requestsData.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </div>
  );
}
