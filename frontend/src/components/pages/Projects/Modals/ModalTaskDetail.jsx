import ModalTaskDetailProvider from './ModalTaskDetailContext';
import ModalTaskDetailContainer from './ModalTaskDetailContainer';

const ModalTaskDetail = () => {
  return (
    <ModalTaskDetailProvider>
      <ModalTaskDetailContainer />
    </ModalTaskDetailProvider>
  );
};

export default ModalTaskDetail;
