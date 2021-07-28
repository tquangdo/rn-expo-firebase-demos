# rn-firebase-demos 🐳

![Stars](https://img.shields.io/github/stars/tquangdo/rn-firebase-demos?color=f05340)
![Issues](https://img.shields.io/github/issues/tquangdo/rn-firebase-demos?color=f05340)
![Forks](https://img.shields.io/github/forks/tquangdo/rn-firebase-demos?color=f05340)
[![Report an issue](https://img.shields.io/badge/Support-Issues-green)](https://github.com/tquangdo/rn-firebase-demos/issues/new)

## Usage
scan bar code on `expo go` appstore

************************
![1](screenshots/1.jpeg)

## firebase & expo notification
1. `App.js`
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
************************
![fbfunction](screenshots/fbfunction.png)

