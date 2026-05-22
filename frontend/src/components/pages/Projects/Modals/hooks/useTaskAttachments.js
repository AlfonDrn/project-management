import { useState } from 'react';
import useModalTaskDetailContext from './useModalTaskDetailContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import services from '@/services';

const taskAttachmentSchema = Yup.object({
  attachments: Yup.array(Yup.mixed()).min(1).required(),
});

const useTaskAttachments = () => {
  const [isLoading, setLoading] = useState();
  const [
    isShowConfirmDeleteTaskAttachment,
    setShowConfirmTaskDeleteAttachment,
  ] = useState({
    show: false,
    item: null,
  });

  const { taskDetailData, taskId, fetchTaskDetail } =
    useModalTaskDetailContext();

  const formTaskAttachment = useForm({
    defaultValues: {
      attachments: [],
    },
    resolver: yupResolver(taskAttachmentSchema),
  });

  const onSubmitTaskAttachment = async (values) => {
    setLoading(true);

    const formData = new FormData();
    formData.append('file', values.attachments[0]);
    await services.cards.uploadAttachment(taskDetailData.public_id, formData);
    await fetchTaskDetail(taskId);

    setLoading(false);
  };

  const onDeleteTaskAttachment = async (attachmentId) => {
    setLoading(true);

    await services.cards.deleteAttachment(
      taskDetailData.public_id,
      attachmentId,
    );
    await fetchTaskDetail(taskId);

    setLoading(false);
    setShowConfirmTaskDeleteAttachment(false);
  };

  return {
    taskDetailData,
    formTaskAttachment,
    isShowConfirmDeleteTaskAttachment,
    setShowConfirmTaskDeleteAttachment,
    isLoading,
    setLoading,
    onSubmitTaskAttachment,
    onDeleteTaskAttachment,
  };
};

export default useTaskAttachments;
