import React from 'react';
import { TextInput, Button, StyleSheet, Text, View, AsyncStorage } from 'react-native';

import { Auth } from 'aws-amplify'

export default class App extends React.Component {
  state = {
    username: '',
    password: '',
    confirmationCode: '',

  }
  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }
   signIn() {
    const { username, password } = this.state
    Auth.signIn(username, password)
    .then( async user => {
      console.log('successful sign in!',user)
      let userId = user['attributes']['sub'];
    
      try {
        await AsyncStorage.setItem('userId', userId);
        this.props.navigation.navigate('AuthLoading')
      } catch (error) {
        // Error retrieving data
        console.log(error.message);
      }

    })
    .catch(err => console.log('error signing in!: ', err))
  }
  signUp() {
    console.log("redirect to sign up page")
    this.props.navigation.navigate('SignUp')
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          onChangeText={value => this.onChangeText('username', value)}
          style={styles.input}
          placeholder='username'
        />
        <TextInput
          onChangeText={value => this.onChangeText('password', value)}
          style={styles.input}
          secureTextEntry={true}
          placeholder='password'
        />
        <Button title="Sign In" onPress={this.signIn.bind(this)} />
        <Button title="Sign Up" onPress={this.signUp.bind(this)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
    margin: 10
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
