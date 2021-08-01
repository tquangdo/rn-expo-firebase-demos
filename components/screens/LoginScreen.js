import firebase from 'firebase';
import React, { Component } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import * as Google from 'expo-google-app-auth'
import { StatusBar } from 'expo-status-bar';

export default class LoginScreen extends Component {
    _isUserEqual = (arg_googleUser, arg_firebaseUser) => {
        if (arg_firebaseUser) {
            var providerData = arg_firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (
                    providerData[i].providerId ===
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === arg_googleUser.getBasicProfile().getId()
                ) {
                    // We don't need to reauth the Firebase connection.
                    return true;
                }
            }
        }
        return false;
    };
    _onSignIn = arg_googleUser => {
        // console.log('Google Auth Response', arg_googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(
            function (arg_firebaseUser) {
                unsubscribe();
                // Check if we are already signed-in Firebase with the correct user.
                if (!this._isUserEqual(arg_googleUser, arg_firebaseUser)) {
                    // Build Firebase credential with the Google ID token.
                    var credential = firebase.auth.GoogleAuthProvider.credential(
                        arg_googleUser.idToken,
                        arg_googleUser.accessToken
                    );
                    // Sign in with credential from the Google user.
                    firebase
                        .auth()
                        .signInWithCredential(credential)
                        .then(function (result) {
                            if (result.additionalUserInfo.isNewUser) {
                                firebase
                                    .database()
                                    .ref('/users/' + result.user.uid)
                                    .set({
                                        gmail: result.user.email,
                                        profile_picture: result.additionalUserInfo.profile.picture,
                                        first_name: result.additionalUserInfo.profile.given_name,
                                        last_name: result.additionalUserInfo.profile.family_name,
                                        created_at: Date.now()
                                    })
                            } else {
                                firebase
                                    .database()
                                    .ref('/users/' + result.user.uid)
                                    .update({
                                        last_logged_in: Date.now()
                                    });
                            }
                        })
                        .catch(function (error) {
                            // Handle Errors here.
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            // The email of the user's account used.
                            var email = error.email;
                            // The firebase.auth.AuthCredential type that was used.
                            var credential = error.credential;
                            alert(`ERR code: ${errorCode}, msg: ${errorMessage}, mail: ${email}, credential: ${credential}`)
                        });
                } else {
                    console.log('User already signed-in Firebase.');
                }
            }.bind(this)
        );
    };
    _signInWithGoogleAsync = async () => {
        try {
            // https://docs.expo.dev/versions/latest/sdk/google/
            const result = await Google.logInAsync({
                // androidClientId: YOUR_CLIENT_ID_HERE,
                iosClientId: '516507242247-o5bdq9mhvooe1h6lo7cvp8fu6i7dgmhb.apps.googleusercontent.com',
                scopes: ['profile', 'email']
            });
            if (result.type === 'success') {
                // console.log('user: ', result.user);
                this._onSignIn(result);
                return result.accessToken;
            } else {
                alert('You already cancelled!!!')
                return { cancelled: true };
            }
        } catch (e) {
            alert(e.toString())
            return { error: true };
        }
    };
    render() {
        return (
            <>
                < StatusBar style="dark" />
                <View style={styles.container}>
                    <Button
                        title="Sign In With Google"
                        onPress={() => this._signInWithGoogleAsync()}
                    />
                </View>
            </>
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