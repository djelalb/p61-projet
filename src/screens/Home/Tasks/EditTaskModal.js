import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, StyleSheet } from 'react-native';
import { Modal, Text, TextInput, Button, useTheme } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';

import { useSelector, useDispatch } from 'react-redux';

export default EditTaskModal = ({ visible, task, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(null);
  const [target, setTarget] = useState(0);
  const [unit, setUnit] = useState('');
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    setName(task?.name);
    setDescription(task?.description);
    setCategory(task?.category);
    setTarget(task?.target);
    setUnit(task?.unit);
    setDate(task?.date ? new Date(task?.date) : new Date());
  }, [task]);

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const categories = useSelector((state) => state.categories.categories).filter((cat) => cat.user_id == user?.id);

  const theme = useTheme();

  const editTask = () => {
    dispatch({
      type: 'TASK_CHANGE',
      payload: {
        ...task,
        name,
        description,
        category,
        target,
        unit,
      },
    });

    onClose();
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onClose}
      contentContainerStyle={{ backgroundColor: theme.colors.surface, ...styles.modalStyles }}
    >
      <Text style={styles.modalTitle}>Modifier une habitude</Text>
      <TextInput
        style={{ marginBottom: 10 }}
        mode="outlined"
        placeholder="Nom de l'habitude*"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={{ marginBottom: 10 }}
        mode="outlined"
        placeholder="Description de l'habitude"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <View
        style={{
          justifyContent: 'center',
          flex: 1,
          alignItems: 'center',
          flexGrow: 0,
          marginTop: 30,
          marginBottom: 40,
        }}
      >
        <DatePickerInput
          disabled={true}
          locale="fr"
          label="Date"
          animationType="fade"
          withDateFormatInLabel={false}
          startWeekOnMonday={true}
          mode="outlined"
          value={date}
          onChange={setDate}
          inputMode="start"
          presentationStyle="pageSheet"
        />
      </View>
      <View style={styles.row}>
        <TextInput
          style={{ marginRight: 5 }}
          mode="outlined"
          placeholder="Objectif*"
          keyboardType="numeric"
          value={target}
          onChangeText={(text) => setTarget(text)}
        />
        <TextInput style={{ flex: 1 }} mode="outlined" placeholder="Unité" value={unit} onChangeText={setUnit} />
      </View>
      <Text style={{ marginTop: 30 }}>Catégorie</Text>
      <Picker
        mode="dropdown"
        style={{ color: theme.colors.onBackground }}
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
      >
        <Picker.Item
          style={{ backgroundColor: theme.colors.background, color: theme.colors.onBackground }}
          label="Sans"
          value={null}
        />
        {categories.map((cat) => (
          <Picker.Item
            style={{ backgroundColor: theme.colors.background, color: theme.colors.onBackground }}
            key={cat.id}
            label={cat.name}
            value={cat.id}
          />
        ))}
      </Picker>
      <Text style={{ marginTop: 30 }}>Fréquence</Text>
      <Text variant="bodyLarge" style={{ color: 'gray', marginTop: 15, marginLeft: 15 }}>
        {
          {
            punctual: 'Ponctuel',
            daily: 'Journalier',
            weekly: 'Hebdomadaire',
            monthly: 'Mensuel',
          }[task?.frequency]
        }
      </Text>
      <Button style={{ marginTop: 40 }} onPress={editTask} disabled={!name?.trim() && !target} mode="contained">
        Modifier
      </Button>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalStyles: {
    alignSelf: 'center',
    borderRadius: 30,
    paddingHorizontal: 40,
    paddingVertical: 30,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  row: {
    flexDirection: 'row',
  },
});
