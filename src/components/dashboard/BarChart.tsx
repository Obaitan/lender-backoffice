import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Define custom tooltip props interface
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white p-2 rounded shadow-md text-sm">
      <p className="text-gray-700 font-medium">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-gray-500 py-0.5">
          {entry.name}: <span className="font-bold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

// Define custom legend props interface
interface CustomLegendProps {
  payload?: Array<{
    value: string;
    color: string;
    type?: string;
  }>;
}

const CustomLegend = ({ payload }: CustomLegendProps) => {
  if (!payload || payload.length === 0) return null;
  return (
    <div className="flex flex-wrap space-x-4 justify-center mt-4">
      {payload.map((entry, index: number) => (
        <div key={index} className="flex items-center space-x-1.5">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className="text-[#667185] text-[13px]">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

// Default sample data
const defaultApplicationsData = [
  { month: 'Jan', approved: 600, suspended: 200, declined: 100 },
  { month: 'Feb', approved: 400, suspended: 150, declined: 180 },
  { month: 'Mar', approved: 620, suspended: 300, declined: 220 },
  { month: 'Apr', approved: 450, suspended: 250, declined: 180 },
  { month: 'May', approved: 500, suspended: 270, declined: 190 },
  { month: 'Jun', approved: 550, suspended: 290, declined: 210 },
  { month: 'Jul', approved: 800, suspended: 400, declined: 300 },
  { month: 'Aug', approved: 780, suspended: 390, declined: 320 },
  { month: 'Sep', approved: 600, suspended: 350, declined: 280 },
  { month: 'Oct', approved: 700, suspended: 370, declined: 300 },
  { month: 'Nov', approved: 650, suspended: 360, declined: 250 },
  { month: 'Dec', approved: 400, suspended: 250, declined: 220 },
];

// Convert month number to name
const getMonthName = (monthNum: number) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return months[monthNum - 1] || '';
};

interface ApplicationByMonth {
  month: number;
  year: number;
  approved: number;
  declined: number;
  inProgress: number;
}

// Process API data into chart-compatible format
const processApiData = (apiData: ApplicationByMonth[] | undefined) => {
  if (!apiData || apiData.length === 0) {
    return defaultApplicationsData;
  }

  // Transform API data into format needed for chart
  const transformedData = apiData.map((item) => ({
    month: getMonthName(item.month),
    approved: item.approved || 0,
    inProgress: item.inProgress || 0,
    declined: item.declined || 0,
  }));

  // If we have data but not for all months, fill in the gaps
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const dataByMonth = new Map();

  transformedData.forEach((item) => {
    dataByMonth.set(item.month, item);
  });

  // Create a complete dataset with all months
  const completeData = months.map((month) => {
    if (dataByMonth.has(month)) {
      return dataByMonth.get(month);
    }
    return {
      month,
      approved: 0,
      inProgress: 0,
      declined: 0,
    };
  });

  return completeData.length > 0 ? completeData : defaultApplicationsData;
};

interface BarChartProps {
  customData?: ApplicationByMonth[];
}

export default function BarChartComponent({ customData }: BarChartProps) {
  // Process API data or use default data
  const applicationsData = processApiData(customData);

  return (
    <div className="xl:px-2">
      <Link
        href={'/applications'}
        className="text-secondary-200 font-medium mb-5 inline-block"
      >
        Applications
      </Link>
      <div className="w-full h-[275px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={applicationsData}
            barCategoryGap={0}
            barGap={1}
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
          >
            <XAxis
              dataKey="month"
              tick={{ fontSize: 13, fill: '#98A0AD' }}
              axisLine={{ stroke: '#D0D3D9' }}
              tickLine={{ stroke: '#D0D3D9' }}
            />
            <YAxis
              tick={{ fontSize: 13, fill: '#98A0AD' }}
              axisLine={{ stroke: '#D0D3D9' }}
              tickLine={{ stroke: '#D0D3D9' }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'transparent' }}
            />
            <Legend content={<CustomLegend />} />
            <Bar
              dataKey="approved"
              fill="#1E3A8A"
              name="Approved"
              barSize={11}
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="inProgress"
              fill="#D6E4ED"
              name="In Progress"
              barSize={11}
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="declined"
              fill="#FF8C42"
              name="Declined"
              barSize={11}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
