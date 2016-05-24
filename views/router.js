import React, { Component } from 'react';
import { Router, Scene, Route, Schema } from 'react-native-router-flux';
import { StyleSheet, Navigator } from 'react-native';
// Views
import CalendarView from './CalendarView';
import DayView from './DayView';
import MonthView from './MonthView';
import WeekView from './WeekView';

// Additional Components
import NavBar from '../components/Toolbar';
import SideDrawer from '../components/SideDrawer';
import moment from 'moment';

// redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { connect } from 'react-redux';

const RouterWithRedux = connect()(Router);
import reducers from '../reducer';
// other imports...

// create store...
const middleware = [/* ...your middleware (i.e. thunk) */];
const store = compose(
  applyMiddleware(...middleware)
)(createStore)(reducers);

function getOffSet() {
  const numberOfWeeksTillStart = moment().startOf('week').diff(moment('2012-01-01 15:30:00'), 'weeks');
  const numberOfMonths = moment().endOf('month').diff(moment('2012-01-01 15:30:00'), 'months');
  return (57 * numberOfWeeksTillStart) + (150 * numberOfMonths);
}

export default class Routes extends Component {
  state = {
    shouldUpdate: true
  }
  updateState = () => {
    this.setState({shouldUpdate: !this.state.shouldUpdate})
  }
  render() {
    return (
      <Provider store={store}>
        <RouterWithRedux navBar={NavBar}>
          <Scene key="root">
            <Scene key="CalendarView" component={CalendarView} title="Calendar View" initial={true} {...this.props} offset={getOffSet()} shouldGoHome={this.state.shouldUpdate} />
            <Scene key="DayView" component={DayView} title="Day View" {...this.props} />
            <Scene key="MonthView" component={MonthView} title="Month View" {...this.props} />
            <Scene key="WeekView" component={WeekView} title="Week View" {...this.props} />
            <Scene name='Drawer' type='reset' key="drawer" component={SideDrawer} />
          </Scene>
        </RouterWithRedux>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
	navBar: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'green',
	},
	navTitle: {
		color: 'white',
	},
	routerScene: {
		paddingTop: Navigator.NavigationBar.Styles.General.NavBarHeight, // some navbar padding to avoid content overlap
	},
	leftButtonContainer: {
		paddingLeft: 15,
		paddingRight: 20,
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
})
