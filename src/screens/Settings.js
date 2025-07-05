import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ToastAndroid } from 'react-native';
import { Button, Text, Switch, useTheme, Modal, Portal } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import uuid from 'react-native-uuid';

export default Settings = () => {
  const [modalLicencesVisible, setModalLicencesVisible] = useState(false);
  const [modalExportImportVisible, setModalExportImportVisible] = useState(false);

  const theme = useTheme();
  const user = useSelector((state) => state.user.user);
  const tasks = useSelector((state) => state.tasks.tasks).filter((task) => task.user_id === user.id);
  const categories = useSelector((state) => state.categories.categories).filter((cat) => cat.user_id === user.id);
  const dispatch = useDispatch();

  const toggleSwitch = () => {
    let updatedUser = {
      id: user.id,
      theme: user.theme !== 'white' ? 'white' : 'dark',
    };

    dispatch({ type: 'USER_UPDATE_PROFILE', payload: updatedUser });
    dispatch({ type: 'USER_SET_PROFILE', payload: updatedUser });
  };

  const importTasksAndCategories = async (user) => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (res.canceled) {
        console.log("La sélection du fichier ne s'est pas bien déroulée.");
        return;
      }

      const fileUri = res.assets && res.assets.length > 0 ? res.assets[0].uri : null;

      if (!fileUri) {
        console.log('Aucun fichier sélectionné ou le format du résultat est incorrect.');
        return;
      }

      const fileContent = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });
      const data = JSON.parse(fileContent);

      // Importer les catégories
      if (data.categories && Array.isArray(data.categories)) {
        const categoriesToAdd = data.categories.filter((category) => {
          return !categories.some((existingCategory) => existingCategory.name === category.name);
        });

        const categoriesWithUserId = categoriesToAdd.map((category) => ({
          ...category,
          id: uuid.v4(), // Générer un nouvel ID pour chaque catégorie
          user_id: user.id,
        }));

        categoriesWithUserId.forEach((category) => {
          dispatch({ type: 'CATEGORY_ADD', payload: category });
        });
      }

      // Importer les tâches
      if (data.tasks && Array.isArray(data.tasks)) {
        const tasksToAdd = data.tasks.filter((task) => {
          return !tasks.some((existingTask) => existingTask.name === task.name);
        });

        const today = new Date().toISOString().split('T')[0];
        const categoryId = categories.find((cat) => cat.name === 'Non catégorisé')?.id;
        const tasksWithUserId = tasksToAdd.map((task) => ({
          ...task,
          id: uuid.v4(), // Générer un nouvel ID pour chaque tâche
          user_id: user.id,
          category: categories.find((cat) => cat.name === task.category)?.id ?? categoryId,
          date: today,
          frequency: 'punctual',
          completed: {},
        }));

        tasksWithUserId.forEach((task) => {
          dispatch({ type: 'TASK_ADD', payload: task });
        });
      }
      // Afficher un toast Android pour indiquer que l'importation est réussie
      ToastAndroid.show('Importation réussie !', ToastAndroid.SHORT);
    } catch (err) {
      console.log("Erreur lors de l'importation des tâches et des catégories : ", err);
    }
  };

  const downloadTasksAndCategories = async () => {
    try {
      const tasksToExport = tasks.map((task) => ({
        ...task,
        user_id: undefined,
      }));

      const categoriesToExport = categories.map((category) => ({
        ...category,
        user_id: undefined,
      }));

      const dataToExport = { tasks: tasksToExport, categories: categoriesToExport };

      const tasksJson = JSON.stringify(dataToExport, null, 2);
      const fileUri = `${FileSystem.documentDirectory}tasks_and_categories.json`;

      await FileSystem.writeAsStringAsync(fileUri, tasksJson);
      await Sharing.shareAsync(fileUri);
    } catch (err) {
      console.log("Erreur lors de l'exportation des tâches et des catégories : ", err);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.header, { color: theme.colors.text }]}>Paramètres</Text>

      <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Thème sombre :</Text>
      <Switch onValueChange={toggleSwitch} value={user.theme !== 'white'} />

      <Button
        style={styles.button}
        mode="contained"
        onPress={() => setModalExportImportVisible(true)}
        buttonColor={theme.colors.primary}
        textColor={theme.colors.onPrimary}
      >
        Export/Import
      </Button>

      <Button
        style={styles.button}
        mode="contained"
        onPress={() => setModalLicencesVisible(true)}
        buttonColor={theme.colors.primary}
        textColor={theme.colors.onPrimary}
      >
        Licences
      </Button>

      <Portal>
        <Modal
          visible={modalLicencesVisible}
          onDismiss={() => setModalLicencesVisible(false)}
          contentContainerStyle={[styles.modalContent, { backgroundColor: theme.colors.surface }]}
        >
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Licences</Text>
          <Text style={[styles.modalText, { color: theme.colors.text }]}>
            MIT License Copyright (c) 2024 CLAUDE TANAEL Permission is hereby granted, free of charge, to any person
            obtaining a copy of this software and associated documentation files (the "Software"), to deal in the
            Software without restriction, including without limitation the rights to use, copy, modify, merge, publish,
            distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions: The above copyright notice and this permission
            notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS
            IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
            COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
            TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
            THE SOFTWARE.
          </Text>
          <Button onPress={() => setModalLicencesVisible(false)}>Retour</Button>
        </Modal>

        <Modal
          visible={modalExportImportVisible}
          onDismiss={() => setModalExportImportVisible(false)}
          contentContainerStyle={[styles.modalContent, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Exporter/Importer</Text>
            <Pressable onPress={() => setModalExportImportVisible(false)}>
              <Text style={[styles.closeButtonText, { color: theme.colors.text }]}>X</Text>
            </Pressable>
          </View>
          <Button style={styles.modalButton} mode="contained" onPress={downloadTasksAndCategories}>
            Exporter
          </Button>
          <Button style={styles.modalButton} mode="contained" onPress={() => importTasksAndCategories(user)}>
            Importer
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 30,
    marginBottom: 20,
  },
  button: {
    marginBottom: 20,
    width: '80%',
  },
  modalContent: {
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 15,
  },
  modalButton: {
    marginTop: 10,
    width: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  closeButtonText: {
    fontSize: 20,
  },
});
