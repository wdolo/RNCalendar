import React, { Component, PropTypes } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    ScrollView,
    View
    } from 'react-native';
import Toolbar from './components/Toolbar';
import Router from './views/router';
import moment from 'moment';

function sortEvents (a, b) {
  if (moment(a.start) > moment(b.start)) return 1;
  if (moment(a.start) < moment(b.start)) return -1;
  return 0;
}
export default class Calendar extends Component {
    static defaultProps = {
        view: 'calendar'
    };
    state = { events: [] };
    eventBuckets = {};
    onScroll(e) {

    }
    componentWillMount() {
      //EVENTS WILL ACTUALLY BE A PROP

      // Sort the events by start date
      this.props.events.sort(sortEvents)
      this.props.events.forEach(event => {
        const week = moment(event.start).startOf('week').format();
        if (!this.eventBuckets[week]) {
          this.eventBuckets[week] = [event]
        } else {
          this.eventBuckets[week].push(event);
        }
      })
    }
    componentDidMount() {
        // Scroll to a specific position once mounted
        // this.refs.scrollView.scrollTo(400);
    }
    render() {
        let component = null;
        return (
          <View style={styles.container}>
            <View style={styles.calendarContainer}>
              <Router events={this.state.events} eventBuckets={this.eventBuckets}/>
           </View>
          </View>
        )
    }
}

Calendar.propTypes = {
    view: PropTypes.string
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  calendarContainer: {
    flex: 1
  }
});
