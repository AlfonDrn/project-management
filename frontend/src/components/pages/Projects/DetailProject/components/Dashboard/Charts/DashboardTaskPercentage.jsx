import { getRandomColor } from '@/utils/dataTransform';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const DashboardTaskPercentage = ({ data }) => {
  const RADIAN = Math.PI / 180;

  const COLORS = useMemo(() => data.map(() => getRandomColor()), [data]);

  const renderCustomizedLabel = (config) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = config;

    if (
      cx == null ||
      cy == null ||
      innerRadius == null ||
      outerRadius == null
    ) {
      return null;
    }
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const ncx = Number(cx);
    const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const ncy = Number(cy);
    const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > ncx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${((percent ?? 1) * 100).toFixed(0)}%`}
      </text>
    );
  };
  return (
    <ResponsiveContainer width="100%" height="100%" aspect={1}>
      <PieChart>
        <Pie
          data={data}
          label={renderCustomizedLabel}
          fill="#8884d8"
          dataKey="value"
          isAnimationActive={true}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
        <Tooltip
          content={DashboardTaskPercentageTooltip}
          isAnimationActive={true}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

const DashboardTaskPercentageTooltip = ({ active, payload, label }) => {
  const data = payload?.[0]?.payload;

  return (
    <Card sx={{ minWidth: 100 }}>
      <CardContent>
        <Stack gap={2}>
          <Typography fontWeight={700}>{data?.name}</Typography>
          <Stack>
            <Typography>Jumlah tugas</Typography>
            <Typography>{data?.count ?? 0}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DashboardTaskPercentage;
