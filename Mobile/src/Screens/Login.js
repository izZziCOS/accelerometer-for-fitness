import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Button,
  StatusBar,
  BackHandler,
} from 'react-native';
import Auth0 from 'react-native-auth0';

const auth0 = new Auth0({
  domain: 'dev-unknown.eu.auth0.com',
  clientId: 'unknown',
});

export default function Login({navigation}) {
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', () => true);
  }, []);

  const handleLoginPress = async () => {
    try {
      let credentials = await auth0.webAuth.authorize({
        scope: 'openid profile email',
      });
      setAuthToken(credentials.accessToken);
      auth0.auth
        .userInfo({token: credentials.accessToken})
        .then((result) =>
          navigation.push('Pagrindinis', {
            userEmail: result.email,
          }),
        )
        .catch(console.error);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View style={styles.sectionContainer}>
            <Button title={'Prisijungti'} onPress={handleLoginPress} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});
