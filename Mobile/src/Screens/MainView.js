import React, {useState, useEffect} from 'react';
import {StyleSheet, View, BackHandler, Button} from 'react-native';
import {useDataApi} from '../utils/data';
import {Spinner} from 'native-base';
import Auth0 from 'react-native-auth0';

const auth0 = new Auth0({
  domain: 'dev-unknown.eu.auth0.com',
  clientId: 'unknown',
});

export default function MainView({route, navigation}) {
  const {userEmail} = route.params;
  const [uExercises, setUExercises] = useState([]);
  const [userExercises] = useDataApi(`/userexercises/${userEmail}`, []);

  useEffect(() => {
    if (
      userExercises.data.exercises !== undefined &&
      userExercises.data.exercises !== ''
    ) {
      var usExercises = JSON.parse(userExercises.data.exercises);
      setUExercises(usExercises);
    }
  }, [userExercises.data.exercises, userEmail]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', () => true);
  }, []);

  if (uExercises.exercises === undefined) {
    if (userExercises.data.id === 0) {
      return (
        <Button
          full
          title={'Atsijungti'}
          onPress={() => navigation.push('Prisijungimas')}
        />
      );
    } else return <Spinner style={{marginTop: 10}} />;
  }

  const handleLogoutPress = () => {
    auth0.webAuth.clearSession().catch((error) => console.log(error));
    navigation.push('Prisijungimas');
  };

  const exerciseCards = uExercises.exercises.map((exercise) => (
    <Button
      key={exercise}
      title={exercise}
      onPress={() =>
        navigation.push('Pratimas', {
          username: userEmail,
          exercise: exercise,
        })
      }
    />
  ));

  return (
    <View style={styles.container}>
      {exerciseCards}
      <View style={styles.bottomView}>
        <Button full title={'Atsijungti'} onPress={handleLogoutPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 12,
    color: '#000',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  containerMain: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomView: {
    width: '100%',
    height: 35,
    backgroundColor: '#2296f3',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
  },
  textStyle: {
    color: '#fff',
    fontSize: 18,
  },
});
