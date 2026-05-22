export const transformTasksToWorkloadData = (allTasks, listId) => {
  console.log('listId', listId);
  const activeTasks = allTasks.filter(
    (task) => task.list_internal_id !== listId,
  );

  const assigneeCounts = activeTasks.reduce((accumulator, task) => {
    const assignees = task.assignees;
    if (!assignees || assignees.length === 0) {
      accumulator['Unassigned'] = (accumulator['Unassigned'] || 0) + 1;
    } else {
      assignees.forEach((assignee) => {
        const name = assignee.user.name;
        accumulator[name] = (accumulator[name] || 0) + 1;
      });
    }

    return accumulator;
  }, {});

  const workloadData = Object.keys(assigneeCounts).map((name) => ({
    assignee: name,
    taskCount: assigneeCounts[name],
  }));

  workloadData.sort((a, b) => b.taskCount - a.taskCount);

  return workloadData;
};

export const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
};
