/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Calendar from './index.js';

//*********************
// DUMMY DATA
//**********************
import moment from 'moment';
const events = [
  {name: "Test", description: "testing", type: "event", color: "red", start: moment().format(), end: moment().endOf('day').format(), isAllDay: false},
  {name: "Franks", description: "Birthday", type: "birthday", color: "orange", start: moment().add(1, 'week').format(), end: moment().add(1, 'week').endOf('day').format(), isAllDay: false},
  {name: "Johns", description: "Birthday", type: "birthday", color: "orange", start:moment().format(), end: moment().endOf('day').format(), isAllDay: false}
];

class RNCalendar extends Component {
  render() {
    return (
        <Calendar events={events}/>
    );
  }
}

AppRegistry.registerComponent('RNCalendar', () => RNCalendar);
