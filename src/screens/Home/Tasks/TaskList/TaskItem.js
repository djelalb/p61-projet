import { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Divider, Checkbox } from 'react-native-paper';

import { useSelector, useDispatch } from 'react-redux';

export default TaskItem = ({ task, onPress, date }) => {
  let formattedDate;
  if (date) formattedDate = date.toISOString().split('T')[0];

  const [checked, setChecked] = useState(date ? task.completed[formattedDate] >= task.target : false);

  const category = useSelector((state) => state.categories.categories).find((cat) => cat.id == task.category);

  const dispatch = useDispatch();

  if (date) {
    useEffect(() => {
      setChecked(task.completed[formattedDate] >= task.target);
    }, [task, date]);
  }

  const updateTaskCompletion = () => {
    let newCompleted = { ...task.completed };

    if (checked) {
      delete newCompleted[formattedDate];
    } else {
      newCompleted[formattedDate] = task.target;
    }

    dispatch({
      type: 'TASK_CHANGE',
      payload: {
        ...task,
        completed: newCompleted,
      },
    });
  };

  return (
    <>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.2 : 1,
          },
          styles.taskContainer,
        ]}
      >
        <View style={[styles.categoryIndicator, { backgroundColor: category?.color ?? 'gray' }]} />
        <View style={styles.taskDetails}>
          <Text style={styles.taskName}>{task.name}</Text>
          <Text style={styles.categoryName}>{category?.name ?? 'Non catégorisé'}</Text>
        </View>
        {date && (
          <>
            <Text style={styles.taskProgress}>
              {task.completed[formattedDate] ?? '0'}
              {task.unit}/{task.target}
              {task.unit}
            </Text>
            <View style={{ transform: [{ scale: 1.25 }] }}>
              <Checkbox
                status={checked ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked(!checked);
                  updateTaskCompletion();
                }}
              />
            </View>
          </>
        )}
      </Pressable>
      <Divider />
    </>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  categoryIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  taskDetails: {
    flex: 1,
  },
  taskName: {
    fontWeight: 'bold',
  },
  categoryName: {
    fontStyle: 'italic',
  },
  taskProgress: {
    marginRight: 10,
    fontWeight: 'bold',
  },
});
