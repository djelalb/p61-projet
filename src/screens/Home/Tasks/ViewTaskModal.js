import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { Modal, Button, useTheme, Text, Divider, IconButton, Portal, Dialog, TextInput } from 'react-native-paper';

import EditTaskModal from './EditTaskModal';

import { useSelector, useDispatch } from 'react-redux';

export default ViewTaskModal = ({ visible, task, onClose, date }) => {
  let formattedDate;
  if (date) formattedDate = date.toISOString().split('T')[0];

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [completedValue, setCompletedValue] = useState('');

  const dispatch = useDispatch();
  const theme = useTheme();

  const category = useSelector((state) => state.categories.categories).find((cat) => cat.id == task?.category);

  if (date) {
    useEffect(() => {
      setCompletedValue(task?.completed[formattedDate]?.toString());
    }, [task]);
  }

  const handleCompletedChange = (text) => {
    setCompletedValue(text);

    dispatch({
      type: 'TASK_CHANGE',
      payload: {
        ...task,
        completed: {
          ...task.completed,
          [formattedDate]: parseInt(text),
        },
      },
    });
  };

  const deleteTask = () => {
    dispatch({
      type: 'TASK_REMOVE',
      payload: task.id,
    });

    setShowDeleteModal(false);
    onClose();
  };

  return (
    <>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={{ backgroundColor: theme.colors.surface, ...styles.modalStyles }}
        style={{ justifyContent: 'center', alignSelf: 'center' }}
      >
        <Text variant="titleLarge">{task?.name}</Text>
        <Divider style={{ marginVertical: 10, alignSelf: 'stretch' }} />
        <View
          style={{
            alignSelf: 'stretch',
            flexDirection: 'row',
            marginVertical: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>
            {new Date(task?.date).toLocaleDateString()}
          </Text>
          <View
            style={{
              backgroundColor: theme.colors.backdrop,
              ...styles.categoryContainer,
            }}
          >
            <View style={[styles.categoryIndicator, { backgroundColor: category ? category.color : 'gray' }]} />
            <Text variant="bodyMedium">{category?.name ?? 'Sans catégorie'}</Text>
          </View>
        </View>

        {task?.description && (
          <View
            style={{
              backgroundColor: theme.colors.backdrop,
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderRadius: 10,
            }}
          >
            <Text variant="bodyLarge" style={{ alignSelf: 'flex-start', marginBottom: 5 }}>
              Description
            </Text>
            <Text style={{ alignSelf: 'flex-end' }}>{task.description}</Text>
          </View>
        )}

        {date && (
          <View
            style={{
              marginTop: 10,
              backgroundColor: theme.colors.backdrop,
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderRadius: 10,
            }}
          >
            <Text variant="bodyLarge" style={{ alignSelf: 'flex-start', marginBottom: 5 }}>
              Progression
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                mode="outlined"
                placeholder="0"
                keyboardType="numeric"
                value={completedValue}
                style={{ height: 40, flex: 1 }}
                text
                onChangeText={handleCompletedChange}
              />
              <Text style={{ alignSelf: 'flex-end', marginLeft: 10 }}>/ {task?.target}</Text>
            </View>
          </View>
        )}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 40,
            justifyContent: 'center',
          }}
        >
          <IconButton style={{ marginRight: 20 }} icon="pencil" size={30} onPress={() => setShowEditTaskModal(true)} />
          <IconButton icon="delete" iconColor={'#e63939'} size={30} onPress={() => setShowDeleteModal(true)} />
        </View>
      </Modal>
      <Portal>
        <Dialog visible={showDeleteModal} onDismiss={() => setShowDeleteModal(false)}>
          <Dialog.Title style={styles.title}>Suppression</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyLarge">
              Voulez-vous vraiment supprimer la tâche <Text style={{ fontWeight: 'bold' }}>{task?.name}</Text> ?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteModal(false)}>Annuler</Button>
            <Button onPress={deleteTask}>Supprimer</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <EditTaskModal
          task={task}
          visible={showEditTaskModal}
          onClose={() => {
            setShowEditTaskModal(false);
            onClose();
          }}
        ></EditTaskModal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  modalStyles: {
    alignSelf: 'center',
    borderRadius: 30,
    paddingHorizontal: 40,
    paddingVertical: 30,
  },
  categoryContainer: {
    marginLeft: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryIndicator: {
    width: 12,
    height: 12,
    borderRadius: 10,
    marginRight: 7,
  },
});
