import { useLoaderData } from 'react-router';
import useDetailProjectContext from './useDetailProjectContext';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import services from '@/services';
import { useForm } from 'react-hook-form';

const createListSchema = Yup.object({
  title: Yup.string().required(),
});

const useCreateNewList = () => {
  const detailProjectData = useLoaderData();
  const detailProjectContext = useDetailProjectContext();

  const [isLoadingCreateList, setLoadingCreateList] = useState(false);
  const [showFormCreateList, setShowFormCreateList] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '',
      board_public_id: detailProjectData.public_id,
    },
    resolver: yupResolver(createListSchema),
  });

  const handleOpenFormCreateList = () => setShowFormCreateList(true);
  const handleCloseFormCreateList = async () => {
    setShowFormCreateList(false);
    setLoadingCreateList(false);
    reset();
    await detailProjectContext.fetchBoardLists();
  };

  const onSubmitCreateList = async (values) => {
    setLoadingCreateList(true);
    await services.lists.create(values);
    handleCloseFormCreateList();
  };

  return {
    isLoadingCreateList,
    showFormCreateList,
    control,
    handleSubmit,
    handleOpenFormCreateList,
    handleCloseFormCreateList,
    onSubmitCreateList,
  };
};

export default useCreateNewList;
