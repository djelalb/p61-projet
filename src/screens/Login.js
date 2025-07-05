import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { TextInput, Button } from 'react-native-paper';
import { View, Text, StyleSheet, ToastAndroid, TouchableOpacity, Image, Animated } from 'react-native';

export default Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

  const login = () => {
    if (!username.trim() || !password.trim()) return;

    const matchingUser = users.find((u) => u.username === username);

    if (!matchingUser) {
      return ToastAndroid.show('Utilisateur non trouvé!', ToastAndroid.SHORT);
    } else if (matchingUser.password !== password) {
      return ToastAndroid.show('Mot de passe invalide!', ToastAndroid.SHORT);
    } else {
      dispatch({
        type: 'USER_LOGIN',
        payload: matchingUser,
      });

      ToastAndroid.show('Connexion réussie!', ToastAndroid.SHORT);
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    }
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgInterpolation }]}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Se connecter</Text>
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
      <Button mode="contained" onPress={login} style={styles.button}>
        Se connecter
      </Button>
      <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Register' }] })}>
        <Text style={styles.createAccountText}>Vous n'avez pas de compte ? Créez-en un</Text>
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
