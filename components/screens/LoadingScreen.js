import firebase from 'firebase';
import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default class LoadingScreen extends Component {
    componentDidMount() {
        this._checkIfLoggedIn();
    }
    _checkIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged(
            function (arg_user) {
                console.log('AUTH STATE CHANGED CALLED!')
                if (arg_user) {
                    this.props.navigation.navigate('DashboardScreen');
                } else {
                    this.props.navigation.navigate('LoginScreen');
                }
            }.bind(this)
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});