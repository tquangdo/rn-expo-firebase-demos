import * as firebase from 'firebase';
import React from 'react';
import { StyleSheet } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import DashboardScreen from './components/screens/DashboardScreen';
import LoadingScreen from './components/screens/LoadingScreen';
import LoginScreen from './components/screens/LoginScreen';

const firebaseConfig = {
  apiKey: "AIzaSyBuIn1T0eZnYYVYuULtEO-ZtuC8tQn9ZqQ",
  authDomain: "rn-demo-e909a.firebaseapp.com",
  databaseURL: "https://rn-demo-e909a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rn-demo-e909a",
  storageBucket: "rn-demo-e909a.appspot.com",
  messagingSenderId: "561771803892",
  appId: "1:561771803892:web:c66939e7637db16e41daa1",
  measurementId: "G-WKX1DYQQXK"
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