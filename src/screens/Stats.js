import { useState } from 'react';
import { Text, useTheme, Button, Icon } from 'react-native-paper';
import { View, StyleSheet, Dimensions } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import { ProgressChart, ContributionGraph } from 'react-native-chart-kit';

import { useSelector } from 'react-redux';

export default Stats = () => {
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [range, setRange] = useState({
    startDate: new Date(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1),
    endDate: new Date(new Date().getUTCFullYear(), new Date().getUTCMonth() + 1, 0),
  });

  const user = useSelector((state) => state.user.user);

  const tasks = useSelector((state) => state.tasks.tasks).filter((task) => task.user_id == user.id);

  /* Completed tasks graph */

  let tasksCountInRange = 0;
  tasks.forEach((task) => {
    if (task.frequency == 'punctual' && new Date(task.date) >= range.startDate && new Date(task.date) <= range.endDate)
      return tasksCountInRange++;

    if (task.frequency == 'daily') {
      let diffDays = range.endDate - new Date(task.date);

      diffDays = diffDays / (1000 * 60 * 60 * 24);

      return (tasksCountInRange = tasksCountInRange + Math.trunc(diffDays));
    }

    if (task.frequency == 'weekly') {
      let diffDays = range.endDate - new Date(task.date);

      diffDays = diffDays / (1000 * 60 * 60 * 24);

      return (tasksCountInRange = tasksCountInRange + Math.trunc(diffDays / 7));
    }

    if (task.frequency == 'monthly') {
      let diffDays = range.endDate - new Date(task.date);

      diffDays = diffDays / (1000 * 60 * 60 * 24);

      return (tasksCountInRange = tasksCountInRange + Math.trunc(diffDays / 30));
    }
  });

  const completedTasks = tasks.filter((task) => task.completed[task.date] >= task.target);

  /* Created tasks graph */

  const createdTasksData = [];

  tasks
    .filter((task) => new Date(task.date) >= range.startDate && new Date(task.date) <= range.endDate)
    .map((task) => task.date)
    .forEach((date) => {
      let createdTask = createdTasksData.find((data) => data.date == date);
      if (createdTask) {
        createdTask.count++;
      } else {
        createdTasksData.push({ date, count: 1 });
      }
    });

  const theme = useTheme();

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={{ backgroundColor: theme.colors.background, ...styles.container }}>
      <View
        style={{
          marginBottom: 20,
          paddingVertical: 10,
          backgroundColor: theme.colors.elevation.level1,
          alignItems: 'center',
          alignSelf: 'stretch',
        }}
      >
        <Button mode="contained-tonal" onPress={() => setShowDatePickerModal(true)}>
          {range.startDate.toLocaleDateString()} <Icon source="arrow-right-thick" />{' '}
          {range.endDate.toLocaleDateString()}
        </Button>
      </View>
      <DatePickerModal
        locale="fr"
        mode="range"
        visible={showDatePickerModal}
        onDismiss={() => setShowDatePickerModal(false)}
        startDate={range.startDate}
        endDate={range.endDate}
        onConfirm={({ startDate, endDate }) => {
          setRange({ startDate, endDate });
          setShowDatePickerModal(false);
        }}
      />
      {!!tasks.length && (
        <>
          <View style={{ paddingVertical: 20, backgroundColor: theme.colors.elevation.level1, borderRadius: 30 }}>
            <Text variant="titleMedium" style={{ textAlign: 'center' }}>
              {Math.round((completedTasks.length / tasksCountInRange) * 100)}% des tâches réalisées
            </Text>
            <ProgressChart
              data={{
                data: [completedTasks.length / tasksCountInRange],
              }}
              width={screenWidth - 100}
              height={150}
              strokeWidth={16}
              radius={50}
              chartConfig={{
                backgroundGradientFrom: theme.colors.elevation.level1,
                backgroundGradientTo: theme.colors.elevation.level1,
                color: (opacity = 1) => theme.colors.primary.replace(/[\d\.]+\)$/g, opacity + ')'),
              }}
              hideLegend={true}
              style={{
                borderRadius: 30,
              }}
            />
          </View>
          <View
            style={{
              paddingVertical: 20,
              marginTop: 20,
              backgroundColor: theme.colors.elevation.level1,
              borderRadius: 30,
            }}
          >
            <Text variant="titleMedium" style={{ textAlign: 'center' }}>
              Tâches créées
            </Text>
            <ContributionGraph
              style={{ backgroundColor: 'red' }}
              values={createdTasksData}
              width={screenWidth - 100}
              numDays={(range.endDate - range.startDate) / (1000 * 60 * 60 * 24) + 1}
              endDate={range.endDate}
              height={220}
              chartConfig={{
                backgroundGradientFrom: theme.colors.elevation.level1,
                backgroundGradientTo: theme.colors.elevation.level1,
                color: (opacity = 1) => theme.colors.primary.replace(/[\d\.]+\)$/g, opacity + ')'),
              }}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
