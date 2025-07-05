import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Portal, FAB, useTheme, Text } from 'react-native-paper';

import { useSelector } from 'react-redux';

import Calendar from './Calendar';

import AddTaskModal from './Tasks/AddTaskModal';
import TaskList from './Tasks/TaskList/TaskList';

export default Home = () => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const theme = useTheme();

  const user = useSelector((state) => state.user.user);

  const tasks = useSelector((state) => state.tasks.tasks)
    .filter((task) => task.user_id == user.id)
    .filter((task) => {
      if (
        (task.frequency == 'punctual' && task.date == selectedDate.toISOString().split('T')[0]) ||
        (task.frequency == 'daily' && new Date(task.date) <= selectedDate) ||
        (task.frequency == 'weekly' &&
          new Date(task.date) <= selectedDate &&
          new Date(task.date).getDay() == selectedDate.getDay()) ||
        (task.frequency == 'monthly' &&
          new Date(task.date) <= selectedDate &&
          new Date(task.date).getDate() == selectedDate.getDate())
      )
        return true;

      return false;
    });

  const calculateProgress = () => {
    const totalCompleted = tasks.filter(
      (task) => task.completed[selectedDate.toISOString().split('T')[0]] >= task.target,
    );

    return totalCompleted.length / tasks.length;
  };

  return (
    <View style={{ backgroundColor: theme.colors.background, ...styles.container }}>
      <View style={{ paddingVertical: 10, marginBottom: 20, backgroundColor: theme.colors.inverseOnSurface }}>
        <Calendar onDateSelected={(date) => setSelectedDate(date.toDate())}></Calendar>
      </View>
      {!!tasks.length && (
        <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
          <View style={{ backgroundColor: theme.colors.primaryContainer, ...styles.progressBarContainer }}>
            <View
              style={{
                width: `${calculateProgress() * 94 + 3}%`,
                backgroundColor: theme.colors.primary,
                ...styles.progressBar,
              }}
            />
          </View>
          <Text style={{ marginLeft: 10 }}>{Math.round(calculateProgress() * 100)}%</Text>
        </View>
      )}
      <View style={{ paddingVertical: 20 }}>
        {!!tasks.length ? (
          <TaskList tasks={tasks} date={selectedDate} />
        ) : (
          <>
            <Text style={{ textAlign: 'center', marginBottom: 10 }} variant="titleLarge">
              :(
            </Text>
            <Text style={{ textAlign: 'center' }} variant="titleMedium">
              Aucune tâche
            </Text>
          </>
        )}
      </View>
      <FAB icon="plus" size="medium" style={styles.fab} onPress={() => setShowAddTaskModal(true)} />
      <Portal>
        <AddTaskModal
          visible={showAddTaskModal}
          onClose={() => setShowAddTaskModal(false)}
          initialDate={selectedDate}
        />
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  progressBarContainer: {
    width: '80%',
    borderRadius: 20,
  },
  progressBar: {
    borderRadius: 20,
    margin: 5,
    height: 10,
  },
});
