import { Appbar } from 'react-native-paper';

import { useSelector } from 'react-redux';

export default HabitsAppBar = ({ navigation, route, back }) => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title="HabitsTracker" />
      {route.name != 'Profile' && isLoggedIn ? (
        <Appbar.Action icon="account" onPress={() => navigation.navigate('Profile')} />
      ) : null}
    </Appbar.Header>
  );
};
