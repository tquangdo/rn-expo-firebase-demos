import * as firebase from 'firebase';
import React from 'react';
import { StyleSheet } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import DashboardScreen from './components/screens/DashboardScreen';
import LoadingScreen from './components/screens/LoadingScreen';
import LoginScreen from './components/screens/LoginScreen';

const firebaseConfig = {
  apiKey: "xxx",
  authDomain: "xxx",
  databaseURL: "xxx",
  projectId: "rn-demo-e909a",
  storageBucket: "rn-demo-e909a.appspot.com",
  messagingSenderId: "xxx",
  appId: "xxx",
  measurementId: "xxx",
};
firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {
  render() {
    return <AppNavigator />
  }
}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: LoginScreen,
  DashboardScreen: DashboardScreen
});

const AppNavigator = createAppContainer(AppSwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});