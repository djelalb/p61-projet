import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Image, StyleSheet, ToastAndroid } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { TextInput, useTheme, Button, Text } from 'react-native-paper';

export default Profile = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.user.user);

  const [firstName, setFirstName] = useState(loggedUser.firstName || '');
  const [lastName, setLastName] = useState(loggedUser.lastName || '');
  const [email, setEmail] = useState(loggedUser.email || '');
  const [location, setLocation] = useState(loggedUser.location || '');
  const [bio, setBio] = useState(loggedUser.bio || '');

  const saveProfile = () => {
    const updatedProfile = {
      id: loggedUser.id,
      firstName,
      lastName,
      email,
      location,
      bio
    };

    dispatch({
      type: 'USER_UPDATE_PROFILE',
      payload: updatedProfile,
    });

    dispatch({
      type: 'USER_SET_PROFILE',
      payload: updatedProfile,
    });

    ToastAndroid.show('Profile updated!', ToastAndroid.SHORT);
  };

  const logout = () => {
    dispatch({
      type: 'USER_LOGOUT',
    });
    ToastAndroid.show('You have been logged out', ToastAndroid.SHORT);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={{ backgroundColor: theme.colors.background, ...styles.container }}>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: 'https://www.bootdey.com/img/Content/avatar/avatar6.png' }} style={styles.avatar} />
          <Text style={styles.name}>{loggedUser.username}</Text>
        </View>
        <TextInput
          mode="outlined"
          label="Prénom"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
          onBlur={saveProfile}
        />
        <TextInput
          mode="outlined"
          label="Nom"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
          onBlur={saveProfile}
        />
        <TextInput
          mode="outlined"
          label="E-Mail"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          onBlur={saveProfile}
        />
        <TextInput
          mode="outlined"
          label="Localisation"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
          onBlur={saveProfile}
        />
        <TextInput
          mode="outlined"
          label="Biographie"
          value={bio}
          onChangeText={setBio}
          style={styles.input}
          onBlur={saveProfile}
        />
        <Button
          mode="elevated"
          style={{
            backgroundColor: theme.colors.errorContainer,
            ...styles.logoutButton,
          }}
          textColor={theme.colors.onErrorContainer}
          onPress={logout}
        >
          Se déconnecter
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    width: '100%',
    marginVertical: 10,
  },
  logoutButton: {
    marginTop: 'auto',
    marginBottom: 40,
  },
});
