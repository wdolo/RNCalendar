import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ListView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Toolbar from '../components/Toolbar';
import moment from 'moment';

function getCurrentWeeks(currWeek) {
  const weekBefore = [];
  const weekAfter  = [];
  const maxWeeksBack = moment(currWeek).diff(moment('2012-01-01 15:30:00'), 'weeks');
  console.log('max weeks', maxWeeksBack);
  for (let i = maxWeeksBack; i > 0; i--) {
    weekBefore.push(moment(currWeek).subtract(i, 'week'));
  }
  for (let i = 1; i < 30; i++) {
    weekAfter.push(moment(currWeek).add(i, 'week'));
  }

  return [
    ...weekBefore,
    moment(currWeek),
    ...weekAfter
  ]
}

function addPrevWeeks(currWeeks) {
  const currWeek = currWeeks[0];
  const weekBefore = [];
  for (let i = 5; i > 0; i--) {
    weekBefore.push(moment(currWeek).subtract(i, 'week'));
  }
  console.log(currWeeks);
  console.log(weekBefore);
  return [
    ...weekBefore,
    ...currWeeks
  ]
}

function addFutureWeeks(currWeeks) {
  const currWeek = currWeeks[currWeeks.length -1];
  const weekAfter  = [];
  for (let i = 1; i < 30; i++) {
    weekAfter.push(moment(currWeek).add(i, 'week'));
  }
  return [
    ...currWeeks,
    ...weekAfter
  ]
}

/*================================
   Stateful Container Component
=================================*/
export default class CalendarView extends Component {
  state = {
    weeks: getCurrentWeeks(moment().startOf('week')),
    dataSource: null,
    canLoadMoreContent: true
  };

  // number of weeks * how big each row is + nuber of events
  prevOffSetY = this.props.offset;
  onEventTap(event) {
    console.log(Actions);
    Actions.DayView({ event })
    console.log(event, 'event');
  }
  fetchEvents(week) {
    const { eventBuckets } = this.props;
    // filter events for current week;
    const events = eventBuckets[moment(week).startOf('week').format()]
    if (events) {
      return events.map((event, index) => <AnEvent event={event} key={index} onPress={() => this.onEventTap(event)}/>)
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.shouldGoHome !== nextProps.shouldGoHome) {
      this.refs.listview.scrollTo({y: this.props.offset});
    }
  }
  onScroll = (e) => {
    const offset = e.nativeEvent.contentOffset.y;
    const screenSize = e.nativeEvent.contentSize.height;
    const isScrollingDown = (this.prevOffSetY - offset > 0);
    const { dataSource, weeks } = this.state;
    this.prevOffsetY = offset;
    console.log(screenSize);
    console.log(offset);
    console.log(this.refs.listview, 'listview');

    console.log(e.nativeEvent);
    console.log(isScrollingDown, 'is scrolling down');
    if (offset < (200) && isScrollingDown) {
      e.stopPropagation();
      const newWeeks = addPrevWeeks(weeks);
      console.log(this.refs.listview, 'listview');
      this.refs.listview.scrollTo({y: offset + 501});
      return this.setState({ dataSource: dataSource.cloneWithRows(newWeeks), weeks: newWeeks })
    } else if (offset > (screenSize - 200) && !isScrollingDown){
      e.stopPropagation();
      const newWeeks = addFutureWeeks(weeks);
      return this.setState({ dataSource: dataSource.cloneWithRows(newWeeks), weeks: newWeeks })
    }
  }
  loadMoreData = () => {
    const { dataSource, weeks } = this.state;
    const newWeeks = addFutureWeeks(weeks);
    return this.setState({ dataSource: dataSource.cloneWithRows(newWeeks), weeks: newWeeks })
  }
  componentWillMount() {
    console.log('props', this.props);
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({
      dataSource: ds.cloneWithRows(getCurrentWeeks(moment().startOf('week')))
    })
  }
  render() {
    return (
      <Toolbar style={styles.listView}/> &&
      <ListView
        style={styles.listView}
        ref="listview"
        dataSource={this.state.dataSource}
        renderRow={(week, i) => (
          <View key={i}>
            <AWeek week={week}/>
            {this.fetchEvents(week)}
          </View>
        )}
        contentOffset={{y: this.prevOffSetY, x: 0}}
        onEndReached={this.loadMoreData}
        onEndReachedThreshold={500}
       />
    )
    {  /*<ScrollView
        ref="scrollView"
        onScroll={this.onScroll}
        scrollEventThrottle={0}
        contentOffset={{y: 2750, x: 0}}
      >{
        this.state.weeks.map((week, index) => {
          return (
            <View key={index}>
              <AWeek week={week}/>
              {this.fetchEvents(week)}
            </View>
          )
        })
      }</ScrollView>*/
    }
  }
}

CalendarView.propTypes = {
};


function AWeek({week}) {
  const isSameMonth = (startWeek, endWeek) => startWeek.month() === endWeek.month()
  // return the correct format for the end week
  const getWeekFormat = (startWeek, endWeek) => {
    if (endWeek.year() !== moment().year()) {
      if (isSameMonth(startWeek, endWeek)) return endWeek.format('DD, YYYY');
      return endWeek.format('MMM DD, YYYY');
    }
    else {
      if (isSameMonth(startWeek, endWeek)) return endWeek.format('DD');
      return endWeek.format('MMM DD');
    }
  }
  const getMonth = (week) => {
    const nextWeek =  moment(week).add(1, 'week');
      if (!isSameMonth(week, nextWeek)) {
        return <AMonth month={nextWeek.format('MMMM YYYY')}/>
      }
  }
  return (
    <View>
      <Text style={styles.week}>{week.format('MMM DD')} -  { getWeekFormat(week, moment(week).add(1, 'week')) }</Text>
      {getMonth(week)}
    </View>
  )
}

function AMonth ({month}) {
  return (
    <View style={styles.monthContainer}>
      <Text style={styles.monthText}>{month}</Text>
    </View>
  )
}

function AnEvent({event, onPress}) {
  const { name, start, end, color = 'orange', description} = event;
  return (
    <View style={[styles.anEventContainer]}>
      <View style={styles.date}>
        <Text style={styles.dayNumber}>{moment(start).format('DD')}</Text>
        <Text style={styles.dayOfWeek}>{moment(start).format('ddd')}</Text>
      </View>
      <TouchableOpacity activeOpacity={.6} onPress={onPress} style={[styles.anEventNameContainer, {backgroundColor: color}]}>
        <Text style={styles.name}> {name} </Text>
        <Text style={styles.description}> {description} </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  listView: {
    marginTop: 56
  },
  week: {
    padding: 20,
    marginLeft: 80
  },
  monthContainer: {
    padding: 50,
    backgroundColor: 'pink',
    marginTop: 10,
    marginBottom: 10
  },
  monthText: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold'
  },
  anEventContainer: {
    flexDirection: 'row',
    padding: 5
  },
  dayNumber: {
    fontSize: 25,
    textAlign: 'center'
  },
  dayOfWeek: {
    textAlign: 'center'
  },
  date: {
    width: 80
  },
  anEventNameContainer: {
    padding: 5,
    borderRadius: 3,
    flex: 1,
    marginRight: 10
  },
  name: {
    color: 'white',
    fontWeight: 'bold'

  },
  description: {
    color: 'white'
  }
});
