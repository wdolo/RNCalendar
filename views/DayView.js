import React, { Component } from 'react';
import {
    AppRegistry,
    PropTypes,
    StyleSheet,
    Text,
    View
    } from 'react-native';
import moment from 'moment';

export default class DayView extends Component {
    render() {
      console.log(this.props)
      const { name, type, start, end } = this.props.event;
      return (
        <View style={styles.dayView}>
          <Text>{name}</Text>
          <Text>Start</Text><Text>{moment(start).format('MMM DD, YYYY')}</Text>
          <Text>End</Text><Text>{moment(end).format('MMM DD, YYYY')}</Text>
        </View>
      )
    }
}

DayView.propTypes = {
};

const styles = StyleSheet.create({
  dayView: {
    marginTop: 80
  }
});
