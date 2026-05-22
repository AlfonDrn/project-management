import { Box, Button, Stack } from '@mui/material';

import { Link } from 'react-router';
import SidebarLayout from '@/components/layouts/SidebarLayout';
import { useEffect, useState } from 'react';
import services from '@/services';
import Table from '@/components/ui/Table';
import datetime from '@/utils/datetime';
import TextField from '@/components/ui/Forms/TextField';
import { useForm, useWatch } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import Pagination from '@/components/ui/Pagination';
import ModalAddNewProject from './Modals/ModalAddNewProject';

const Projects = () => {
  const [isLoading, setLoading] = useState(false);
  const [boardsData, setBoardsData] = useState([]);
  const [boardsMeta, setBoardsMeta] = useState({});
  const [page, setPage] = useState(1);

  const [openModalAddNewProject, setOpenModalAddNewProject] = useState(false);

  const { control } = useForm({
    defaultValues: {
      search: '',
    },
  });

  const watchSearch = useWatch({
    control,
    name: 'search',
  });

  const [debounceSearch] = useDebounce(watchSearch, 1000);

  const fetchBoardsData = async () => {
    setLoading(true);
    const response = await services.boards.myBoards({
      filter: debounceSearch,
      limit: 10,
      page,
    });
    setBoardsData(response.data.data);
    setBoardsMeta(response.data.meta);
    setLoading(false);
  };

  useEffect(() => {
    fetchBoardsData();
  }, [debounceSearch, page]); // onMounted

  const handleOpenAddnewProject = () => setOpenModalAddNewProject(true);
  const handleCloseAddNewProject = async () => {
    await fetchBoardsData();
    setOpenModalAddNewProject(false);
  };

  return (
    <>
      <SidebarLayout
        pageTitle="Daftar Proyek"
        breadcrumbs={[
          {
            label: 'Daftar Proyek',
          },
        ]}
      >
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Box>
            <TextField
              control={control}
              label={'Cari nama proyek'}
              id="search"
              name="search"
              size="small"
            />
          </Box>
          <Box>
            <Button
              type="button"
              variant="contained"
              onClick={handleOpenAddnewProject}
            >
              Buat Proyek Baru
            </Button>
          </Box>
        </Stack>
        <Table
          isLoading={isLoading}
          data={boardsData}
          columns={[
            {
              id: 'title',
              label: 'Nama Proyek',
            },
            {
              id: 'description',
              label: 'Deskripsi',
            },
            {
              id: 'created_at',
              label: 'Tanggal dibuat',
              render(data) {
                return (
                  <Box>{datetime.format(data.create_at, 'DD/MM/YYYY')}</Box>
                );
              },
            },
            {
              id: 'action',
              label: 'Aksi',
              render(data) {
                return (
                  <Link to={`/projects/${data.public_id}`}>
                    <Button type="button" variant="outlined">
                      Detail proyek
                    </Button>
                  </Link>
                );
              },
            },
          ]}
        />
        <Pagination
          count={boardsMeta.total_page}
          onChange={(e, page) => {
            setPage(page);
          }}
        />
      </SidebarLayout>
      <ModalAddNewProject
        open={openModalAddNewProject}
        handleClose={handleCloseAddNewProject}
      />
    </>
  );
};

export default Projects;
