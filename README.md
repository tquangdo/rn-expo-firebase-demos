# rn-firebase-demos 🐳

![Stars](https://img.shields.io/github/stars/tquangdo/rn-firebase-demos?color=f05340)
![Issues](https://img.shields.io/github/issues/tquangdo/rn-firebase-demos?color=f05340)
![Forks](https://img.shields.io/github/forks/tquangdo/rn-firebase-demos?color=f05340)
[![Report an issue](https://img.shields.io/badge/Support-Issues-green)](https://github.com/tquangdo/rn-firebase-demos/issues/new)

## Usage
scan bar code on `expo go` appstore

## 1) Push notification

************************
![1](screenshots/1.jpeg)

### firebase & expo notification
1. `SwipeList&PushNoti.js`
```js
  componentDidMount() {
    try {
      this.fbase_auth.signInWithEmailAndPassword('dotq@email.com', '123456').then(
        arg_user => { this._registerForPushNotificationsAsync(arg_user) }
      )
```
- => when run expo on iphone, it will create user record (with `expoToken`) in DB:
************************
![userdb](screenshots/userdb.png)

2. `functions/index.js`
```js
    return db.ref('/users').once('value').then(function (snapshot) {
```
- => add a name will push Expo notification by trigger function `sendPushNotification`
>28/7/2021 NOT show notification in iphone, still don't know why?
************************
![fbfunction](screenshots/fbfunction.png)

## 2) GG login

************************
![G1](screenshots/G1.jpeg)
************************
![G2](screenshots/G2.jpeg)

### GG API
- `https://console.cloud.google.com/apis/credentials`
- `Create credentials` > `OAuth client ID`
- `Application type` > `iOS`
- `Name` > `iOS client 1`
- `Bundle ID` > `host.exp.exponent`

************************
![ggapi](screenshots/ggapi.png)

### GG firebase
- firebase > Authentication > Sign-in method > Google: Enable > Safelist client IDs from external projects (optional)
- copy paste `OAuth client ID`

### src code
- `components/screens/LoginScreen.js: iosClientId: '<OAuth client ID>'`

************************
![clientid](screenshots/clientid.png)

### install package
- `https://docs.expo.dev/versions/latest/sdk/google/`
- `expo install expo-google-app-auth`
- `components/screens/LoginScreen.js: import * as Google from 'expo-google-app-auth'`

### running result
- firebase > Authentication > Users > show gmail login acc
- firebase > Realtime Database > users > uid > record with login acc info

