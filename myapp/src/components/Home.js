import React from 'react';
import { Alert, Button, StyleSheet, Text,View, AsyncStorage } from 'react-native';

import Amplify, { API, graphqlOperation } from "aws-amplify";
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
//import * as subscriptions from '../graphql/subscriptions';
import _ from "lodash";


export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[]
    };
  }

  _renderData() {
      return _.map(this.state.data, (item, index) => {
        return (
            <View key={index} style={{flex: 1, flexDirection: 'row', height:10}}>
                    <Text>{item.title}</Text>
                    <Button title="Edit" onPress={this.updateSample.bind(this)} />
                    <Button title="Delete" onPress={this.removeSample.bind(this)} />
            </View>
          )
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{margin:20, padding: 10, fontSize: 42}} >Hello World</Text>
        <Text>Type What You Need To Do!!</Text>
       
       {/* <View>
            {this._renderData()}
       </View> */}
        <View>
          <Button title="create new data to db" onPress={this.addSample.bind(this)} />
        </View> 
        <View>
          <Button title="update data to db" onPress={this.updateSample.bind(this)} />
        </View> 
        <View>
          <Button title="delete data from db" onPress={this.removeSample.bind(this)} />
        </View> 

        <Button title="Actually, sign me out :)" onPress={this._signOutAsync} />
      </View>
    );
  }
  
  _signOutAsync = async () => {
    console.log("sign out requested")
    let user_id = await AsyncStorage.getItem('userID');
    console.log("I am about to delete userId: ", user_id);
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  _onPressButton() {
    Alert.alert('You tapped the button!')
  }


  componentDidMount(){
    this.getSample();
  }

  async getSample() {
    const allTodos = await API.graphql(graphqlOperation(queries.listTodos));
    console.log(allTodos.data.listTodos.items);
    this.setState({
        data: allTodos.data.listTodos.items
    })
   }

  async addSample() {
    let userId = await AsyncStorage.getItem('userId')

    let todoDetails = {
      title: 'study graphql',
      user_id: '',
      description: 'you need to study all the time! :)'
    };

    todoDetails.user_id= userId;

    const newTodo = await API.graphql(graphqlOperation(mutations.createTodo, {input: todoDetails}));
    console.log(newTodo);
  }

  async updateSample() {

    let userId = await AsyncStorage.getItem('userId')

    let todoDetails = {
      id: "3737d9ec-9ce1-465e-b2bd-2976a74dd422",
    //   title: "Changed title",
      description: 'updatinsdfdfsdfsdfg :)'
    };

    todoDetails.user_id= userId;

    const newTodo = await API.graphql(graphqlOperation(mutations.updateTodo, {input: todoDetails}));
    console.log(newTodo);
  }

  async removeSample() {
    const removedTodo = await API.graphql(graphqlOperation(mutations.deleteTodo, {input: {id: "be388110-13ab-491c-9050-50f2a8a14849"}}));
    console.log(removedTodo);
  }
}

const styles = StyleSheet.create({
    container: { 
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });