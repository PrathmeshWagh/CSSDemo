import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import WebView from 'react-native-webview';
import { OneSignal } from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CheckBox from '@react-native-community/checkbox';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';

const LoginScreen = ({ navigation }: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [userId, setUserId] = useState(null);
  const [webViewUrl, setWebViewUrl] = useState('https://ecom.cssdemo.app/');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);



  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        const loginMethod = await AsyncStorage.getItem('loginMethod');

        if (isLoggedIn === 'true') {
          setUsername(storedUsername);
          if (loginMethod === 'facebook') {
            const token = await AsyncStorage.getItem('acces sToken');
            if (token) {
              await handleFacebookLogin(token, true);
            } else {
              setIsLoggedIn(false);
              setIsLoading(false);
            }
          } else {
            const storedPassword = await AsyncStorage.getItem('password');
            await handleLogin(storedUsername, storedPassword, true);
          }
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const storeData = async (data) => {
    try {
      await AsyncStorage.setItem('user_data', JSON.stringify(data));
    } catch (error) {
      console.error('storeData error:', error);
    }
  };

  const getStorageData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user_data');
      return JSON.parse(jsonValue);
    } catch (error) {
      console.error('getStorageData error:', error);
    }
  };

  useEffect(() => {
    const getPushSubscriptionStatus = async () => {
      try {
        const optedIn = await OneSignal.User.pushSubscription.getIdAsync();
        console.log('optid', optedIn);

        if (userId) {
          await sendPlayerIdToBackend(optedIn);
        }
      } catch (error) {
        console.error('Error checking push subscription status:', error);
      }
    };
    if (isLoggedIn) {
      getPushSubscriptionStatus();
    }
  }, [isLoggedIn]);

  const sendPlayerIdToBackend = async (playerId) => {
    try {
      const body = { player_id: playerId };
      const storedData = await getStorageData();

      const setHeader = () => {
        return storedData ? `Bearer ${storedData.access_token}` : '';
      };

      await axios.post('https://lfksingapore.com/api/v2/auth/get-consumer-player-id', body, {
        headers: {
          Authorization: setHeader(),
          Accept: 'application/json',
        },
      });
    } catch (error) {
      console.error('Error sending player ID to backend:', error);
    }
  };

  const handleLogin = async (loginUsername = username, loginPassword = password, fromStorage = false) => {
    try {
      const response = await fetch('https://lfksingapore.com/api/v2/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginUsername,
          password: loginPassword,
        }),
      });
      const data = await response.json();

      if (data.result) {
        setUserId(data.user.id);
        setIsLoggedIn(true);
        setWebViewUrl(`https://lfksingapore.com/mobile-dashboard?email=${loginUsername}&password=${loginPassword}`);

        if (!fromStorage) {
          await storeData(data);
          await AsyncStorage.setItem('username', loginUsername);
          await AsyncStorage.setItem('password', loginPassword);
          await AsyncStorage.setItem('isLoggedIn', 'true');
          await AsyncStorage.setItem('loginMethod', 'normal');
        }
      } else {
        Alert.alert('Login failed', data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login error', 'Something went wrong, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebViewMessage = async (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.action === 'logout') {
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('password');
        await AsyncStorage.removeItem('isLoggedIn');
        await AsyncStorage.removeItem('loginMethod');
        await AsyncStorage.removeItem('accessToken');
        setIsLoggedIn(false);
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      console.error('Error handling WebView message:', error);
    }
  };

  const handleFacebookLogin = async (token, fromStorage = false) => {
    setIsLoading(true);

    try {
      if (!fromStorage) {
        LoginManager.logOut()
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
        if (result.isCancelled) {
          throw 'User cancelled the login process';
        }
        console.log('result', result);


        const data = await AccessToken.getCurrentAccessToken();
        console.log('data', data);

        if (!data) {
          throw 'Something went wrong obtaining access token';
        }
        token = data.accessToken;
      }

      const backendResponse = await axios.post('https://lfksingapore.com/api/v2/auth/facebook-login', {
        access_token: token,
      });
      // console.log('backendResponse',backendResponse);


      const backendData = backendResponse.data;

      if (backendData.status) {
        setUserId(backendData.user.id);
        setIsLoggedIn(true);
        setWebViewUrl(`https://lfksingapore.com/mobile-dashboard?provider=facebook&provider_id=${backendData.user.provider_id}`);

        await storeData(backendData);
        // await AsyncStorage.setItem('username', backendData.user.email);
        // await AsyncStorage.setItem('password', '');
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('loginMethod', 'facebook');
        await AsyncStorage.setItem('accessToken', token);
      } else {
        Alert.alert('Login failed', backendData.message);

      }
    } catch (error) {
      console.error('Facebook login error:', error);
      Alert.alert('Login error', 'Something went wrong, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
  }

  return (
    <View style={{ flex: 1 }}>
      {!isLoggedIn ? (
        <View style={styles.loginContainer}>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Image source={require('../image/css.jpg')} resizeMode='contain' style={{ width: '80%', height: 180 }} />
          </View>
          <View>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.loginText}>Login to your account.</Text>
          </View>

          <View style={{ marginHorizontal: 40 }}>
            <Text style={styles.usernameLabel}>Username or Email or Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={{ marginHorizontal: 40 }}>
            <Text style={styles.usernameLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={{ marginHorizontal: 35, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CheckBox
                disabled={false}
                value={toggleCheckBox}
                onValueChange={(newValue) => setToggleCheckBox(newValue)}
              />
              <Text style={{ color: 'black', fontSize: 14, fontWeight: '500' }}>Remember Me</Text>
            </View>

            <Pressable onPress={() => navigation.navigate('ForgotPasswordScreen')}>
              <Text style={{ color: 'black', fontSize: 14, fontWeight: '500', textDecorationLine: 'underline' }}>Forgot password?</Text>
            </Pressable>
          </View>

          <Pressable style={styles.loginBtn} onPress={() => handleLogin(username, password)}>
            <Text style={styles.btnText}>Login</Text>
          </Pressable>

          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={{ fontSize: 15, fontWeight: '400', color: 'black' }}>Or Login With</Text>
            <Pressable
              style={{ marginTop: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'blue', alignItems: 'center', justifyContent: 'center' }}
              onPress={() => handleFacebookLogin()}
            >
              <Text style={{ fontSize: 35, fontWeight: '800', color: 'white' }}>f</Text>
            </Pressable>
          </View>

          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={{ color: 'black', fontSize: 14, fontWeight: '500' }}>Don't have an account?</Text>
            <Pressable onPress={() => navigation.navigate('RegistrationScreen')}>
              <Text style={{ color: 'red', fontSize: 17, fontWeight: '600', textAlign: 'center' }}>Register Now</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <WebView
          source={{ uri: webViewUrl }}
          style={{ flex: 1 }}
          onMessage={handleWebViewMessage}
          userAgent="ReactNativeWebView"
        />
      )}

    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor:'white'
  },
  welcomeText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 25,
    fontWeight: '600',
    marginBottom: 20,
  },
  loginText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 20,
  },
  usernameLabel: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  loginBtn: {
    marginTop: 30,
    alignSelf: 'center',
    width: '60%',
    height: 40,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 0.4,
    borderColor: 'red',
    backgroundColor: 'red',
    justifyContent: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});