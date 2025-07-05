import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, Text } from 'react-native-paper';
import { View, StyleSheet, ToastAndroid, TouchableOpacity, Image, Animated } from 'react-native';
import { useState, useEffect } from 'react';
import uuid from 'react-native-uuid';
import { useDispatch } from 'react-redux';

export default Register = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bgAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(bgAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [bgAnim]);

  const bgInterpolation = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#1a1a1a', '#2E1A47'],
  });

  const register = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
      return ToastAndroid.show('Tous les champs sont obligatoires!', ToastAndroid.SHORT);
    }

    if (password !== confirmPassword) {
      return ToastAndroid.show('Les mots de passe ne correspondent pas!', ToastAndroid.SHORT);
    }

    let id = uuid.v4();
    let user = { id, firstName, lastName, email, username, password };

    dispatch({
      type: 'USERS_CREATE',
      payload: user,
    });

    dispatch({
      type: 'USER_LOGIN',
      payload: user,
    });

    ToastAndroid.show('Inscription réussie!', ToastAndroid.SHORT);
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgInterpolation }]}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Créer un compte</Text>

      <TextInput
        style={styles.input}
        mode="outlined"
        label="Prénom"
        value={firstName}
        onChangeText={setFirstName}
        theme={{ colors: { text: '#fff', placeholder: '#aaa', primary: '#fff' } }}
      />
      <TextInput
        style={styles.input}
        mode="outlined"
        label="Nom"
        value={lastName}
        onChangeText={setLastName}
        theme={{ colors: { text: '#fff', placeholder: '#aaa', primary: '#fff' } }}
      />
      <TextInput
        style={styles.input}
        mode="outlined"
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        theme={{ colors: { text: '#fff', placeholder: '#aaa', primary: '#fff' } }}
      />
      <TextInput
        style={styles.input}
        mode="outlined"
        label="Pseudo"
        value={username}
        onChangeText={setUsername}
        theme={{ colors: { text: '#fff', placeholder: '#aaa', primary: '#fff' } }}
      />
      <TextInput
        style={styles.input}
        mode="outlined"
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        theme={{ colors: { text: '#fff', placeholder: '#aaa', primary: '#fff' } }}
      />
      <TextInput
        style={styles.input}
        mode="outlined"
        label="Confirmer le mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        theme={{ colors: { text: '#fff', placeholder: '#aaa', primary: '#fff' } }}
      />

      <Button mode="contained" onPress={register} style={styles.button}>
        S'inscrire
      </Button>

      <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}>
        <Text style={styles.createAccountText}>Vous posséder déjà un compte ? Identifiez-vous</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    width: '85%',
    marginBottom: 10,
    backgroundColor: '#444',
  },
  button: {
    width: '85%',
    marginTop: 10,
    backgroundColor: '#5a67d8',
  },
  createAccountText: {
    marginTop: 20,
    color: '#aaa',
  },
});
