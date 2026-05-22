import { Box, Button, Stack, Typography } from '@mui/material';
import useCreateNewList from '../hooks/useCreateNewList';
import { PlusOne } from '@mui/icons-material';
import TextField from '@/components/ui/Forms/TextField';

const CreateNewList = () => {
  const {
    showFormCreateList,
    handleOpenFormCreateList,
    control,
    handleSubmit,
    handleCloseFormCreateList,
    onSubmitCreateList,
    isLoadingCreateList,
  } = useCreateNewList();

  return (
    <Box
      sx={{
        flexBasis: 300,
        flexShrink: 0,
        overflow: 'auto',
      }}
    >
      {showFormCreateList ? (
        <Box
          sx={{
            p: 1,
          }}
          component={'form'}
          onSubmit={handleSubmit(onSubmitCreateList)}
        >
          <TextField
            control={control}
            name="title"
            label={'Nama daftar tugas'}
            fullWidth
            autoFocus
          />
          <Stack direction={'row'} gap={1} justifyContent={'flex-end'}>
            <Button
              type="submit"
              variant="contained"
              size="small"
              disabled={isLoadingCreateList}
              loading={isLoadingCreateList}
            >
              Simpan
            </Button>
            <Button
              type="button"
              variant="outlined"
              size="small"
              onClick={handleCloseFormCreateList}
              disabled={isLoadingCreateList}
            >
              Batal
            </Button>
          </Stack>
        </Box>
      ) : (
        <Button
          fullWidth
          size="large"
          type="button"
          variant="contained"
          onClick={handleOpenFormCreateList}
          startIcon={<PlusOne />}
        >
          Buat daftar tugas
        </Button>
      )}
    </Box>
  );
};

export default CreateNewList;
