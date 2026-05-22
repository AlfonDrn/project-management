import { useMemo, useState } from 'react';
import useDetailProjectContext from './useDetailProjectContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import services from '@/services';

const createNewTaskSchema = Yup.object({
  title: Yup.string().required(),
});

const useCreateNewTask = (listId) => {
  const detailProjectContext = useDetailProjectContext();

  const taskItemsData = detailProjectContext.getTaskItemsByListId(listId);

  const taskItemsDataIds = useMemo(() => {
    return taskItemsData.map((item) => item.public_id);
  }, [taskItemsData]);

  const [isLoading, setLoading] = useState(false);
  const [isShowFormCreateNewTask, setShowFormCreateNewTask] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '',
    },
    resolver: yupResolver(createNewTaskSchema),
  });

  const handleOpenFormCreateNewTask = () => setShowFormCreateNewTask(true);
  const handleCloseFormCreateNewTask = () => setShowFormCreateNewTask(false);

  const onSubmit = async (values) => {
    setLoading(true);
    await services.cards.create({
      ...values,
      list_id: listId,
      position: taskItemsDataIds.length === 0 ? 1 : taskItemsDataIds.length + 1,
    });
    setLoading(false);
    reset();
    handleCloseFormCreateNewTask();
    await detailProjectContext.fetchBoardLists();
  };

  return {
    isLoading,
    isShowFormCreateNewTask,
    control,
    handleSubmit,
    handleOpenFormCreateNewTask,
    handleCloseFormCreateNewTask,
    onSubmit,
  };
};

export default useCreateNewTask;
