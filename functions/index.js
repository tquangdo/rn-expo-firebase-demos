const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase);
let fetch = require('node-fetch')
const db = admin.database()

exports.sendPushNotification = functions.database.ref('contacts/{id}').onCreate(event => {
    let messages = []

    //return the main promise
    console.log('event: ', event)
    return db.ref('/users').once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            let expoToken = childSnapshot.val().expoToken
            if (expoToken) {
                messages.push({
                    "to": expoToken,
                    // "to": "ExponentPushToken[hd1LJqOwcQBGhZIMcBV3-N]",
                    "body": "New Note Added"
                })
            }
        })
        return Promise.all(messages)
    }).then(messages => {
        fetch('https://exp.host/--/api/v2/push/send', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(messages)
        })
    })
})