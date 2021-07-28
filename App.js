import * as firebase from 'firebase';
import Button from 'react-native-button';
import React from 'react';
import { StyleSheet, Text, TextInput, View, FlatList, TouchableOpacity, TouchableHighlight } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from "@expo/vector-icons";
import { SwipeListView } from 'react-native-swipe-list-view'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'

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
  constructor(props) {
    super(props);
    this.fbase_auth = firebase.auth()
    this.fbase_rtimedb = firebase.database()
    this.state = {
      staFlatListData: [],
      staNewContact: ""
    }
  }
  componentDidMount() {
    try {
      this.fbase_auth.signInWithEmailAndPassword('dotq@email.com', '123456').then(
        arg_user => { this._registerForPushNotificationsAsync(arg_user) }
      )
      this.fbase_rtimedb.ref('/contacts').on('value', (snapshot) => {
        let li = []
        snapshot.forEach((child) => {
          li.push({
            key: child.key,
            name: child.val().name,
          })
        })
        this.setState({ staFlatListData: li })
      })
    } catch (error) {
      alert(error.toString())
    }
  }
  async _addRow(arg_data) {
    try {
      let key = this.fbase_rtimedb.ref('/contacts').push().key
      await this.fbase_rtimedb.ref('/contacts').child(key).set({ name: arg_data })
    } catch (error) {
      alert(error.toString())
    }
  }
  _closeRow = (arg_row_map, arg_key) => {
    if (arg_row_map[arg_key]) {
      arg_row_map[arg_key].closeRow();
    }
  }
  async _deleteRow(arg_row_map, arg_key) {
    try {
      const { staFlatListData } = this.state
      await this.fbase_rtimedb.ref('contacts/' + arg_key).set(null)
      this._closeRow(arg_row_map, arg_key);
      const newData = [...staFlatListData];
      const prevIndex = staFlatListData.findIndex(item => item.key === arg_key);
      newData.splice(prevIndex, 1);
      this.setState({ staFlatListData: newData });
    } catch (error) {
      alert(error.toString())
    }
  }
  _renderHiddenItem = (arg_data, arg_row_map) => (
    <View style={styles.rowBack}>
      <Text>Left</Text>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => this._deleteRow(arg_row_map, arg_data.item.key)}
      >
        <Text style={styles.backTextWhite}>Delete</Text>
      </TouchableOpacity>
    </View>
  )
  // _onRowDidOpen = arg_key => {
  //   console.log('This row opened', arg_key);
  // }
  _registerForPushNotificationsAsync = async (arg_current_user) => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert('Must use physical device for Push Notifications');
    }
    await this.fbase_rtimedb.ref('/users/' + arg_current_user.user.uid).set({
      email: arg_current_user.user.email,
      expoToken: token,
    })
  }

  render() {
    const { staFlatListData, staNewContact } = this.state
    return (
      <>
        <StatusBar style="dark" />
        <View style={styles.container}>
          <TextInput
            style={styles.addName}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={(staNewContact) => this.setState({ staNewContact })}
            placeholder="Add name"
          />
          <Button
            containerStyle={styles.buttonContainer}
            onPress={() => this._addRow(staNewContact)}>
            {/* https://fontawesome.com/icons */}
            <FontAwesome5 name="plus-circle" style={styles.fontawesome5} />
          </Button>
          <SwipeListView
            data={staFlatListData}
            renderItem={({ item }) => {
              return <TouchableHighlight
                // onPress={() => console.log('You touched me')}
                style={styles.rowFront}
                underlayColor={'#AAA'}
              >
                <Text>{item.name}</Text>
              </TouchableHighlight>
            }}
            renderHiddenItem={this._renderHiddenItem}
            leftOpenValue={75}
            rightOpenValue={-150}
            previewRowKey={'0'}
            previewOpenValue={-40}
            previewOpenDelay={3000}
          // onRowDidOpen={this._onRowDidOpen}
          />


          {/* <View style={styles.flatlist}>
            <FlatList
              data={staFlatListData}
              renderItem={({ item }) => {
                console.log('item: ', item)
                return <Text>{item.name}</Text>
              }}
              keyExtractor={item => item.key}
            />
          </View> */}
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  addName: {
    height: 40,
    borderBottomColor: 'gray',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 40,
    marginBottom: 10,
    borderBottomWidth: 1
  },
  fontawesome5: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    left: 22,
  },
  buttonContainer: {
    padding: 8,
    marginLeft: 150,
    marginRight: 150,
    marginBottom: 50,
    height: 40,
    borderRadius: 6,
    backgroundColor: 'mediumseagreen'
  },
  flatlist: {
    flex: 1,
    alignItems: 'center',
  },
  backTextWhite: {
    color: '#FFF',
  },
  // SwipeListView
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
});