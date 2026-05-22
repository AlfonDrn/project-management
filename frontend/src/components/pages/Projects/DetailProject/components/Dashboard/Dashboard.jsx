import { Stack, Typography } from '@mui/material';
import DashboardMetric from './Metrics/DashboardMetric';
import {
  AccessTimeFilled,
  Assignment,
  WarningAmber,
} from '@mui/icons-material';
import useDashboardData from '../../hooks/useDashboardData';
import DashboardWorkload from './Charts/DashboardWorkload';
import DashboardTaskPercentage from './Charts/DashboardTaskPercentage';

const Dashboard = () => {
  const {
    totalTaskSummary,
    overdueTasksSummary,
    dueSoonTasksSummary,
    workloadSummary,
    taskPercentageSummary,
  } = useDashboardData();
  return (
    <Stack width={'100%'} gap={3} mt={5}>
      <Stack
        direction={'row'}
        gap={1}
        justifyContent={'stretch'}
        alignItems={'stretch'}
      >
        <DashboardMetric
          title={'Total Tugas Proyek'}
          value={totalTaskSummary.length}
          icon={Assignment}
          color={'#1976d2'}
        />
        <DashboardMetric
          title={'Total Tugas Melebihi Batas Waktu'}
          value={overdueTasksSummary.length}
          icon={AccessTimeFilled}
          color={'#d32f2f'}
        />
        <DashboardMetric
          title={'Total Tugas Mendekati Batas Waktu'}
          value={dueSoonTasksSummary.length}
          icon={WarningAmber}
          color={'#ffa000'}
        />
      </Stack>
      <Stack direction={'row'} gap={1} height={500}>
        <Stack gap={3} flex={1}>
          <Typography variant="h5">Sebaran tugas</Typography>
          <DashboardTaskPercentage data={taskPercentageSummary} />
        </Stack>
        <Stack gap={3} flex={1}>
          <Typography variant="h5">Pembagian kerja</Typography>
          <DashboardWorkload data={workloadSummary} />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Dashboard;
