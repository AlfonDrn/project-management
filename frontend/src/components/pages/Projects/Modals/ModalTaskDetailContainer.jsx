import Modal from '@/components/ui/Modal';
import useModalTaskDetail from './hooks/useModalTaskDetail';
import { Box, Button, colors, Stack, Typography } from '@mui/material';
import TextField from '@/components/ui/Forms/TextField';
import datetime from '@/utils/datetime';
import DatePicker from '@/components/ui/Forms/DatePicker';
import dayjs from 'dayjs';
import { Delete } from '@mui/icons-material';
import TaskAssignees from './components/TaskAssignees';
import TaskAttachments from './components/TaskAttachments';

const ModalTaskDetailContainer = () => {
  const {
    taskId,
    handleClose,
    taskDetailData,
    editTitle,
    setEditTitle,
    formTask,
    onSubmit,
    isLoading,
    editDescription,
    setEditDescription,
    editDueDate,
    setEditDueDate,
    detailProjectData,
    isShowConfirmDelete,
    setShowConfirmDelete,
    handleDeleteTask,
  } = useModalTaskDetail();

  const renderTitle = () => {
    return (
      <Stack gap={2}>
        <Typography variant="h5" fontWeight={700}>
          Judul
        </Typography>
        {editTitle ? (
          <Box component={'form'} onSubmit={formTask.handleSubmit(onSubmit)}>
            <TextField
              control={formTask.control}
              name={'title'}
              fullWidth
              disabled={isLoading}
            />
            <Stack direction={'row'} justifyContent={'flex-end'} gap={1}>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                loading={isLoading}
              >
                Simpan
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={() => setEditTitle(false)}
                disabled={isLoading}
              >
                Batal
              </Button>
            </Stack>
          </Box>
        ) : (
          <Typography
            component={'a'}
            variant="body2"
            sx={{
              display: 'block',
              ':hover': {
                background: colors.grey[100],
                cursor: 'pointer',
                p: 1,
                borderRadius: 1,
              },
            }}
            onClick={() => setEditTitle(true)}
          >
            {taskDetailData.title || 'Belum ada judul, klik untuk menambahkan'}
          </Typography>
        )}
      </Stack>
    );
  };

  const renderDescription = () => {
    return (
      <Stack gap={2}>
        <Typography variant="h5" fontWeight={700}>
          Deskripsi Tugas
        </Typography>
        {editDescription ? (
          <Box component={'form'} onSubmit={formTask.handleSubmit(onSubmit)}>
            <TextField
              control={formTask.control}
              name={'description'}
              multiline
              rows={10}
              fullWidth
              disabled={isLoading}
            />
            <Stack direction={'row'} justifyContent={'flex-end'} gap={1}>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                loading={isLoading}
              >
                Simpan
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={() => setEditDescription(false)}
                disabled={isLoading}
              >
                Batal
              </Button>
            </Stack>
          </Box>
        ) : (
          <Typography
            component={'a'}
            variant="body2"
            sx={{
              display: 'block',
              ':hover': {
                background: colors.grey[100],
                cursor: 'pointer',
                p: 1,
                borderRadius: 1,
              },
            }}
            onClick={() => setEditDescription(true)}
          >
            {taskDetailData.description ||
              'Belum ada deskripsi tugas, klik untuk menambahkan'}
          </Typography>
        )}
      </Stack>
    );
  };

  const renderDueDate = () => {
    return (
      <Stack gap={2}>
        <Typography variant="h5" fontWeight={700}>
          Deadline
        </Typography>
        {editDueDate ? (
          <Box component={'form'} onSubmit={formTask.handleSubmit(onSubmit)}>
            <DatePicker
              control={formTask.control}
              name={'due_date'}
              fullWidth
              disabled={isLoading}
              minDate={dayjs()}
              maxDate={dayjs(detailProjectData.due_date)}
            />
            <Stack direction={'row'} justifyContent={'flex-end'} gap={1}>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                loading={isLoading}
              >
                Simpan
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={() => setEditDueDate(false)}
                disabled={isLoading}
              >
                Batal
              </Button>
            </Stack>
          </Box>
        ) : (
          <Typography
            component={'a'}
            variant="body2"
            sx={{
              display: 'block',
              ':hover': {
                background: colors.grey[100],
                cursor: 'pointer',
                p: 1,
                borderRadius: 1,
              },
            }}
            onClick={() => setEditDueDate(true)}
          >
            {taskDetailData.due_date &&
            taskDetailData.due_date === '0001-01-01T00:00:00Z'
              ? 'Belum ada deadline, klik untuk menambahkan'
              : datetime.format(taskDetailData.due_date, 'DD MMMM YYYY')}
          </Typography>
        )}
      </Stack>
    );
  };

  const renderTaskDetailActions = () => {
    return (
      <Stack
        sx={{
          position: 'sticky',
          bottom: 0,
          background: 'white',
          p: 2,
          borderTop: `1px solid ${colors.grey[300]}`,
        }}
        direction={'row'}
        justifyContent={'flex-end'}
        gap={1}
      >
        {isShowConfirmDelete ? (
          <Stack direction={'row'} gap={1} alignItems={'center'}>
            <Typography variant="body2">
              Apakah anda yakin untuk menghapus tugas ini?
            </Typography>
            <Button
              type="button"
              color="error"
              onClick={handleDeleteTask}
              disabled={isLoading}
            >
              Ya
            </Button>
            <Button
              variant="text"
              onClick={() => setShowConfirmDelete(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
          </Stack>
        ) : (
          <>
            <Button
              startIcon={<Delete />}
              variant="outlined"
              color="error"
              onClick={() => setShowConfirmDelete(true)}
              disabled={isLoading}
            >
              Hapus
            </Button>
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={isLoading}
            >
              Tutup
            </Button>
          </>
        )}
      </Stack>
    );
  };

  return (
    <Modal
      open={taskId}
      handleClose={handleClose}
      title={taskDetailData?.title || ''}
    >
      <Stack
        direction={'row'}
        gap={2}
        alignItems={'flex-start'}
        justifyContent={'space-between'}
        sx={{
          width: 1000,
          height: 600,
          overflowY: 'auto',
          p: 2,
        }}
      >
        <Stack width={'65%'} gap={2}>
          {renderTitle()}
          {renderDescription()}
        </Stack>
        <Stack width={'35%'} gap={2}>
          {renderDueDate()}
          <TaskAssignees />
          <TaskAttachments />
        </Stack>
      </Stack>
      {renderTaskDetailActions()}
    </Modal>
  );
};

export default ModalTaskDetailContainer;
