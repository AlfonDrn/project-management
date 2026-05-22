import { useState, version } from 'react';
import useDetailProjectContext from './useDetailProjectContext';
import { useDroppable } from '@dnd-kit/core';
import { DRAG_LIST } from '@/utils/constants';
import { useSortable } from '@dnd-kit/sortable';
import services from '@/services';

const useListSortableItem = ({ id, item }) => {
  const detailProjectContext = useDetailProjectContext();
  const taskItems = detailProjectContext.getTaskItemsByListId(item.public_id);

  const [isShowConfirmDelete, setShowConfirmDelete] = useState(false);

  const {
    setNodeRef: setNodeRefDroppable,
    isOver,
    active,
    over,
  } = useDroppable({
    id,
    data: {
      ...item,
      type: DRAG_LIST,
    },
  });

  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id,
      data: {
        ...item,
        type: DRAG_LIST,
      },
    });

  const handleDeleteList = (listId) => async (e) => {
    await services.lists.remove(listId);
    await detailProjectContext.fetchBoardLists();
    setShowConfirmDelete(false);
  };

  return {
    detailProjectContext,
    taskItems,
    handleDeleteList,
    isShowConfirmDelete,
    setShowConfirmDelete,
    droppable: {
      isOver,
      active,
      over,
      setNodeRefDroppable,
    },
    sortable: {
      setNodeRef,
      attributes,
      listeners,
      transition,
      transform,
    },
  };
};

export default useListSortableItem;
