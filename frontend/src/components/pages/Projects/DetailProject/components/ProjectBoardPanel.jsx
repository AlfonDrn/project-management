import { Stack } from '@mui/material';
import CreateNewList from './CreateNewList';
import ListSortableItem from './ListSortableItem';
import useDetailProjectContainer from '../hooks/useDetailProjectContainer';
import {
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
} from '@dnd-kit/core';
import {
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import { DRAG_CARD, DRAG_LIST } from '@/utils/constants';
import TaskSortableItem from './TaskSortableItem';
import ProjectInfo from './ProjectInfo';
import { TabPanel } from '@mui/lab';

const ProjectBoardPanel = ({ value }) => {
  const {
    boardListData,
    activeDragItem,
    boardListDataMapPublicIds,
    handleDragEnd,
    handleDragCancel,
    handleDragStart,
    sensors,
  } = useDetailProjectContainer();

  const renderDragOverlay = () => {
    if (activeDragItem && activeDragItem.type === DRAG_LIST) {
      return (
        <ListSortableItem id={activeDragItem.public_id} item={activeDragItem} />
      );
    }
    if (activeDragItem && activeDragItem.type === DRAG_CARD) {
      return (
        <TaskSortableItem
          listId={activeDragItem.list_public_id}
          id={activeDragItem.public_id}
          item={activeDragItem}
        />
      );
    }
    return <></>;
  };

  return (
    <TabPanel
      value={value}
      sx={{
        paddingY: 3,
        paddingX: 0,
      }}
    >
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        sensors={sensors}
      >
        <ProjectInfo />
        <SortableContext
          items={boardListDataMapPublicIds}
          strategy={horizontalListSortingStrategy}
        >
          <Stack
            direction={'row'}
            justifyContent={'flex-start'}
            alignItems={'flex-start'}
            gap={2}
            pb={5}
            sx={{
              overflowX: 'auto',
            }}
          >
            {boardListData?.map((item) => (
              <ListSortableItem
                key={item.public_id}
                id={item.public_id}
                item={item}
              />
            ))}
            <CreateNewList />
          </Stack>
        </SortableContext>
        <DragOverlay
          dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: '0.4',
                },
              },
            }),
          }}
        >
          {renderDragOverlay()}
        </DragOverlay>
      </DndContext>
    </TabPanel>
  );
};

export default ProjectBoardPanel;
