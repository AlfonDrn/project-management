import { useCallback, useEffect, useMemo, useState } from 'react';
import useDetailProjectContext from './useDetailProjectContext';
import services from '@/services';
import { transformTasksToWorkloadData } from '@/utils/dataTransform';
import datetime from '@/utils/datetime';

const useDashboardData = () => {
  const [totalTaskSummary, setTotalTaskSummary] = useState([]);
  const [workloadSummary, setWorkloadSummary] = useState([]);
  const [overdueTasksSummary, setOverdueTasksSummary] = useState([]);
  const [dueSoonTasksSummary, setDueSoonTasksSummary] = useState([]);

  const { isLoadingBoardLists, boardListData, getTaskItemsByListId } =
    useDetailProjectContext();

  const mergeListAndTaskData = useMemo(() => {
    const taskItems = boardListData.map((item) => {
      const { title, public_id } = item;
      const tasks = getTaskItemsByListId(public_id);
      return {
        ...item,
        title,
        tasks,
        count: tasks.length,
      };
    });

    return taskItems;
  }, [boardListData]);

  const taskPercentageSummary = useMemo(() => {
    const taskItems = mergeListAndTaskData;
    const taskItemsTotal = taskItems.reduce((a, b) => {
      return a + b.count;
    }, 0);
    const result = [...taskItems].map((item) => ({
      name: item.title,
      count: item.count,
      value: Math.floor((item.count / taskItemsTotal) * 100),
    }));
    return result;
  }, [mergeListAndTaskData]);

  const initDashboardData = useCallback(async () => {
    if (mergeListAndTaskData.length > 0 && !isLoadingBoardLists) {
      let workload = [];
      const tasks = [];
      const overdueTasks = [];
      const dueSoonTasks = [];

      for (const idx in mergeListAndTaskData) {
        const listItem = mergeListAndTaskData[idx];
        const fetchTasks = await Promise.all(
          [...listItem.tasks].map((item) =>
            services.cards.getDetail(item.public_id),
          ),
        );

        const taskData = fetchTasks.map((item) => item?.data?.data);

        taskData.forEach((item) => tasks.push(item));
      }

      for (const idx in tasks) {
        const taskItem = tasks[idx];
        workload = transformTasksToWorkloadData(tasks, taskItem.internal_id);

        const now = datetime.getNow();
        const isOverdue = datetime.isSameOrAfter(
          now.toISOString(),
          taskItem.due_date,
        );
        const diff = datetime.getDiff(now.toISOString(), taskItem.due_date);

        if (isOverdue) {
          overdueTasks.push(taskItem);
        } else if (diff <= 3 && diff >= 1) {
          dueSoonTasks.push(taskItem);
        }
      }

      setWorkloadSummary(workload);
      setOverdueTasksSummary(overdueTasks);
      setDueSoonTasksSummary(dueSoonTasks);
      setTotalTaskSummary(tasks);
    }
  }, [mergeListAndTaskData]);

  useEffect(() => {
    initDashboardData();
  }, [mergeListAndTaskData, isLoadingBoardLists]);

  return {
    totalTaskSummary,
    workloadSummary,
    overdueTasksSummary,
    dueSoonTasksSummary,
    taskPercentageSummary,
    mergeListAndTaskData,
    isLoadingBoardLists,
  };
};

export default useDashboardData;
