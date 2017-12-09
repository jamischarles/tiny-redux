// This is a very simple, but working example of redux without all the optional abstractions
// to run this code via the index.html file you'll need an http server like https://www.npmjs.com/package/http-server

import { createStore, applyMiddleware, combineReducers } from './tiny-redux.js';

/**************************************
 * EXAMPLE 1) Simple Redux app
 **************************************/

// BANANA STATE #######################
var defaultBananaState = 0;

// reducer that calculates the new state based on
// actions that you dispatch
function banana(state = defaultBananaState, action) {
	if (action.type === 'INCREMENT') {
		return state + 1;
	}

	return state;
}

var store = createStore(banana);

// subscribe to store updates
store.subscribe(function() {
	console.log('Ex1: STATE UPDATED', store.getState());
})

console.log('Ex1: state:before', store.getState());
store.dispatch({type: 'INCREMENT'});
console.log('Ex1: state:after', store.getState());






/**************************************
 * EXAMPLE 2) Less simple Redux app
 **************************************/

// APPLE STATE #######################
var defaultAppleState = 0;

function apple(state = defaultAppleState, action) {
	if (action.type === 'INCREMENT') {
		return state + 1;
	}

	return state;
}

// ORANGE STATE #########################
var defaultOrangeState = 10;

function orange(state = defaultOrangeState, action) {
	if (action.type === 'EAT_ORANGE') {
		return state - 1;
	}

	return state;
}


// logger middleware
function logger(store) {
	var getState = store.getState;

	return function (next) {
		// this fn will be called every time you call store.dispatch if passed to applyMiddleware()
		return function (action) {
			console.log('Ex2: will dispatch', action);

			var returnValue = next(action); // Call the next dispatch method in the middleware chain.

			console.log('Ex2: state after dispatch', getState());

			return returnValue;
		};
	};
}


// combine the reducers into a single root reducer
var rootReducer = combineReducers({
	apple: apple,
	orange: orange
})

var store = createStore(
	rootReducer,
	applyMiddleware(logger)
);

// listen for store updates
var unsub = store.subscribe(function() {
	console.log('Ex2: STATE UPDATED', store.getState());
})

console.log('Ex2: state:before', store.getState());
store.dispatch({type: 'INCREMENT'});
store.dispatch({type: 'EAT_ORANGE'});
console.log('Ex2: state:after', store.getState());
unsub();
store.dispatch({type: 'INCREMENT'});



