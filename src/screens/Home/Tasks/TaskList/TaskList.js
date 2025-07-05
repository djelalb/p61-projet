import { useState } from 'react';

import { FlatList } from 'react-native';
import { Portal } from 'react-native-paper';
import TaskItem from './TaskItem';
import ViewTaskModal from '../ViewTaskModal';

export default TaskList = ({ tasks, date }) => {
  const [openTaskModal, setOpenTaskModal] = useState(null);

  return (
    <>
      <FlatList
        data={tasks}
        renderItem={({ item }) => <TaskItem task={item} date={date} onPress={() => setOpenTaskModal(item)} />}
        keyExtractor={(item) => item.id.toString()}
      />
      <Portal>
        <ViewTaskModal
          visible={openTaskModal}
          task={openTaskModal}
          date={date}
          onClose={() => setOpenTaskModal(null)}
        />
      </Portal>
    </>
  );
};
