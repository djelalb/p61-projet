import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, StyleSheet } from 'react-native';
import { Modal, Text, TextInput, Button, useTheme } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';

import uuid from 'react-native-uuid';

import { useSelector, useDispatch } from 'react-redux';

export default AddTaskModal = ({ visible, onClose, initialDate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(null);
  const [target, setTarget] = useState(1);
  const [frequency, setFrequency] = useState('punctual');
  const [unit, setUnit] = useState('');
  const [date, setDate] = useState(initialDate);

  useEffect(() => {
    setDate(initialDate);
  }, [initialDate]);

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const categories = useSelector((state) => state.categories.categories).filter((cat) => cat.user_id == user?.id);

  const theme = useTheme();

  const addTask = () => {
    dispatch({
      type: 'TASK_ADD',
      payload: {
        id: uuid.v4(),
        user_id: user.id,
        name,
        date: [
          date.getFullYear(),
          (date.getMonth() + 1).toString().padStart(2, '0'),
          date.getDate().toString().padStart(2, '0'),
        ].join('-'),
        completed: {},
        frequency,
        description,
        category,
        target: target < 1 ? 1 : target,
        unit,
      },
    });

    setName('');
    setDescription('');
    setCategory(null);
    setTarget(0);
    setFrequency('punctual');
    setUnit('');

    onClose();
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onClose}
      contentContainerStyle={{ backgroundColor: theme.colors.surface, ...styles.modalStyles }}
    >
      <Text style={styles.modalTitle}>Ajouter une habitude</Text>
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
      <Picker
        style={{ color: theme.colors.onBackground }}
        mode="dropdown"
        selectedValue={frequency}
        onValueChange={(itemValue, itemIndex) => setFrequency(itemValue)}
      >
        <Picker.Item
          style={{ backgroundColor: theme.colors.background, color: theme.colors.onBackground }}
          label="Ponctuel"
          value="punctual"
        />
        <Picker.Item
          style={{ backgroundColor: theme.colors.background, color: theme.colors.onBackground }}
          label="Journalier"
          value="daily"
        />
        <Picker.Item
          style={{ backgroundColor: theme.colors.background, color: theme.colors.onBackground }}
          label="Hebdomadaire"
          value="weekly"
        />
        <Picker.Item
          style={{ backgroundColor: theme.colors.background, color: theme.colors.onBackground }}
          label="Mensuel"
          value="monthly"
        />
      </Picker>
      <Button style={{ marginTop: 40 }} onPress={addTask} disabled={!name.trim() && !target} mode="contained">
        Ajouter
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
