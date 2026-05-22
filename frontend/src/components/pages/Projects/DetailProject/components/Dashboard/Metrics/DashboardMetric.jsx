import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

const DashboardMetric = ({ title, value, icon: IconComponent, color }) => {
  return (
    <Card
      sx={{
        minWidth: 275,
        width: '100%',
        bgcolor: color,
        color: 'white',
      }}
    >
      <CardContent>
        <Typography variant="subtitle2" gutterBottom sx={{ opacity: 0.8 }}>
          {title}
        </Typography>
        <Stack justifyContent={'space-between'} alignItems={'center'}>
          <Typography variant="h3" component={'div'} fontWeight={'bold'}>
            {value}
          </Typography>
          {IconComponent && (
            <IconComponent sx={{ fontSize: 40, opacity: 0.7 }} />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DashboardMetric;
