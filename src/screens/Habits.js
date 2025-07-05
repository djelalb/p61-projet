import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

import { TextInput, Button, useTheme } from 'react-native-paper';

import TaskItem from './Home/Tasks/TaskList/TaskItem';
import ViewTaskModal from './Home/Tasks/ViewTaskModal';
import AddTaskModal from './Home/Tasks/AddTaskModal';

export default Habits = () => {
  const [search, setSearch] = useState('');
  const [openTaskModal, setOpenTaskModal] = useState(null);
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);

  const tasks = useSelector((state) => state.tasks.tasks);
  const user = useSelector((state) => state.user.user);

  const theme = useTheme();

  const filteredTasks = tasks.filter(
    (task) => task.user_id === user.id && task.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={{ backgroundColor: theme.colors.background, ...styles.container }}>
      <TextInput style={styles.searchInput} placeholder="Recherche des habitudes..." value={search} onChangeText={setSearch} />
      <FlatList
        data={filteredTasks}
        renderItem={({ item }) => <TaskItem task={item} onPress={() => setOpenTaskModal(item)} />}
        keyExtractor={(item) => item.id.toString()}
      />
      <Button mode="contained" onPress={() => setIsAddTaskModalVisible(true)}>
        Ajouter une nouvelle habitude
      </Button>
      <ViewTaskModal visible={!!openTaskModal} task={openTaskModal} onClose={() => setOpenTaskModal(null)} />
      <AddTaskModal visible={isAddTaskModalVisible} onClose={() => setIsAddTaskModalVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    align: 'center',
    padding: 16,
  },
  searchInput: {
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
