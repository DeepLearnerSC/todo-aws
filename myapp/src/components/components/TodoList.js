import React, { Component } from 'react';
import { TouchableOpacity, Button, StyleSheet, Text,View, AsyncStorage } from 'react-native';
import _ from "lodash";

export default class TodoList extends Component {

    _deleteSample(item, index) {
        // console.log("pressed",item.id);
        this.props.deleteSample(item.id, index);
    }

    render () {
        return _.map(this.props.todoList, (item, index) => {
            return (
            <View key={index} style={{flex: 1, flexDirection: 'row'}}>
                <View style={{width: 250, height:40, backgroundColor:'#841584', alignItems : "center", justifyContent: 'center' }}>
                    <Text style={{color:'white',fontSize:20}}>{item.title}</Text>
                </View>
                <TouchableOpacity 
                  style={{height:40, backgroundColor:'#DDDDDD', padding: 10,  alignItems: 'center',}} 
                  onPress={() => this._deleteSample(item,index)} 
                >
                <Text>
                    Delete
                </Text>
                </TouchableOpacity>
            </View> 
            )
        })
    }
}
