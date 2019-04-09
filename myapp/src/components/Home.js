import React from 'react';
import { ScrollView,TextInput, Button, TouchableOpacity,StyleSheet, Text,View, AsyncStorage } from 'react-native';

import Amplify, { API, graphqlOperation } from "aws-amplify";
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
//import * as subscriptions from '../graphql/subscriptions';
import _ from "lodash";
import TodoListScreen from './components/TodoList';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[],
      text: ""
    };
    this.createSample = this.createSample.bind(this)
    this.deleteSample = this.deleteSample.bind(this)
  }

  componentDidMount(){
    if(this.state.data.length===0){
      this.getSample();
      console.log('should render once');
    }
    console.log('sdf')
  }

  async getSample() {
    const allTodos = await API.graphql(graphqlOperation(queries.listTodos));
    console.log(allTodos.data.listTodos.items);
    this.setState({
        data: allTodos.data.listTodos.items
    })
   }

   async createSample() {
    let todoDetails = {};
    if (this.state.text === ""){
      console.log("please type something");
    } else {
      todoDetails.title= this.state.text;
      const newTodo = await API.graphql(graphqlOperation(mutations.createTodo, {input: todoDetails}));
      console.log(newTodo);
      //this.state.text='';
      this.getSample();
      //this.props.navigation.navigate('Home');
    }

  }

   async deleteSample(id,i) {
    //console.log(id)
    const deleteTodo = await API.graphql(graphqlOperation(mutations.deleteTodo, {input: {id: id}}));
    console.log(deleteTodo);
    this.getSample();
  }

  render() {
    return (
      <ScrollView >
        <View style={{flex: 1, alignItems : "center", justifyContent: 'center'}}>
          <Text style={{flex: 1, margin:20, padding: 10, fontSize: 42}} >Hello World</Text>
          <Text style={{flex: 1, margin:10, fontSize: 20}}>Type What You Need To Do!!</Text>

          <View style={{flex:1, flexDirection: 'column', margin :10}} >
            <View style={{flex: 1, flexDirection: 'row'}}>
              <TextInput
                style={{width: 250, height: 40, textAlign:"center"}}
                placeholder="Type Todo over here!"
                onChangeText={(text) => {
                  this.setState({text});
                  console.log(this.state.text)
                }}
              />
              <TouchableOpacity 
                style={{height:40, backgroundColor:'#DDDDDD', padding: 10,  alignItems: 'center',}} 
                onPress={() => this.createSample()} 
              >
                <Text>
                    Create
                </Text>
              </TouchableOpacity>
            </View> 
          </View>

          <Text style={{flex: 1, margin:10, fontSize: 20}}>Your To-do List is here!!</Text>

          <View style={{flex:1, margin:10, flexDirection: 'column'}}>
            {this.state.data.length > 0 ? <TodoListScreen todoList={this.state.data} deleteSample={this.deleteSample} /> : null}
          </View>


          <Text style={{flex: 1, margin:10, fontSize: 20}}>Will make edit modal later...</Text>
          <View style={{flex: 1, marginTop:40, marginBottom:20}}>
            <Button title="update data to db" onPress={this.updateSample.bind(this)} />
          </View> 

          <TouchableOpacity 
            style={{height:40, backgroundColor:'#DDDDDD', padding: 10,  alignItems: 'center',}} 
            onPress={() => _signOutAsync()} 
          >
            <Text>
              Sign Me Out :)
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
  
  _signOutAsync = async () => {
    // console.log("sign out requested")
    // let user_id = await AsyncStorage.getItem('userID');
    // console.log("I am about to delete userId: ", user_id);
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };



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


}

