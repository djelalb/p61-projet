import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, ToastAndroid } from 'react-native';
import { TextInput, Text, Button, IconButton, useTheme, Portal, Dialog } from 'react-native-paper';
import ColorPicker, { HueCircular } from 'reanimated-color-picker';
import { useDispatch, useSelector } from 'react-redux';
import uuid from 'react-native-uuid';

const Categories = () => {
  const [name, setName] = useState('');
  const [categoryColor, setCategoryColor] = useState('red');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const theme = useTheme();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const categories = useSelector((state) => state.categories.categories).filter((cat) => cat.user_id === user.id);

  const renderCategory = useCallback(({ item }) => (
    <View style={[styles.categoryContainer, { backgroundColor: item.color }]}>
      <Text style={styles.categoryText}>{item.name}</Text>
      <IconButton
        icon="delete"
        size={20}
        onPress={() => handleDeleteCategoryRequest(item.id)}
        accessibilityLabel={`Delete ${item.name}`}
      />
    </View>
  ), []);

  const handleAddCategory = () => {
    if (name.trim() === '') {
      return ToastAndroid.show('Pas de nom pour la catégorie, veuillez en choisir un.', ToastAndroid.SHORT);
    }

    const categoryExists = categories.some((category) => category.name.toLowerCase() === name.toLowerCase());
    if (categoryExists) {
      return ToastAndroid.show('Cette catégorie existe déjà.', ToastAndroid.SHORT);
    }

    dispatch({
      type: 'CATEGORY_ADD',
      payload: {
        id: uuid.v4(),
        user_id: user.id,
        name: name.trim(),
        color: categoryColor,
      },
    });
    setName('');
  };

  const handleDeleteCategoryRequest = (id) => {
    setCategoryToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteCategory = () => {
    dispatch({ type: 'CATEGORY_REMOVE', payload: categoryToDelete });
    setCategoryToDelete(null);
    setShowDeleteDialog(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TextInput
        style={styles.inputCategory}
        mode="outlined"
        label="Nom de la catégorie"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.colorPickerLabel}>Choix de la couleur :</Text>
      <ColorPicker
        style={styles.colorPicker}
        value={categoryColor}
        onComplete={({ hex }) => setCategoryColor(hex)}
      >
        <HueCircular containerStyle={{ backgroundColor: theme.colors.background }} />
      </ColorPicker>
      <Button
        mode="outlined"
        rippleColor="gray"
        onPress={handleAddCategory}
        style={[styles.addButton, { borderColor: categoryColor }]}
        accessibilityLabel="Ajouter une catégorie"
      >
        Ajouter
      </Button>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
        style={styles.categoryList}
      />
      <Portal>
        <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
          <Dialog.Title style={styles.title}>Suppression</Dialog.Title>
          <Dialog.Content>
            <Text>Voulez-vous vraiment supprimer cette catégorie ?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>Annuler</Button>
            <Button onPress={handleDeleteCategory}>Supprimer</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  inputCategory: {
    width: '70%',
    marginBottom: 10,
  },
  colorPickerLabel: {
    marginVertical: 20,
    fontSize: 17,
  },
  colorPicker: {
    width: '50%',
    marginBottom: 10,
  },
  addButton: {
    marginTop: 10,
    borderWidth: 2,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  categoryList: {
    width: '100%',
    marginTop: 40,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  categoryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    textAlign: 'center',
  },
});
