// This is a simplified redux implementation for learning purposes. It works with the code in index.js.
// It's missing perf considerations and helpful warnings. Don't use this in production.


// creates store and returns store obj.
export function createStore(reducer, enhancer) {

	// if applymiddleware or similar is passed in, let that function
	// call createStore so we can enhance dispatch() with the middleware
	// functions
	if (typeof enhancer === "function") {
		return enhancer(createStore)(reducer);
	}

	var state;
	var subscriptions = [];

	var obj = {
		getState: function() {
			return state;
		},
		// calls the reducer, and assigns new state returned from reducer
		dispatch: function(action) {
			state = reducer(state, action);

			// notifies any subscribed functions that state has changed
			subscriptions.forEach(function(fn) {
				fn();
			})

			return action;
		},
		// will notify functions that the state has changed
		subscribe: function(fn) {
			subscriptions.push(fn);

			// allows 'var unsub = subscribe(fn)' so you can then call unsub() to unsubscribe
			return function unsubscribe() {
				// find listener fn in sub array and remove it
				var index = subscriptions.indexOf(fn);
				subscriptions.splice(index, 1);
			}
		}
	}

	// populate the store with default state, so that calling store.getState()
	// before calling dispatch will have default values
	obj.dispatch({type: 'REDUX_INIT'});
	return obj;
}

// combines multiple reducers into a single function that when called, will call all
// the other reducers and assign the state for each property based on the associated reducer
export function combineReducers(stateTree) {
	var keys = Object.keys(stateTree);

	// returns a function that returns the state tree
	return function rootReducer(state = {}, action) {

		// loop through each of the keys passed to the rootReducer
		// stateTree = {
		// 	apple: appleReducer,
		// 	orange: orangeReducer
		// })
		for (var i=0; i < keys.length; i++) {
			var key = keys[i];
			var reducer = stateTree[key]
			var subState = state[key];

			// call each reducer, and save the data at the corresponding key
			// apple: apple(appleState, action),
			// orange: orange(orangeState, action)
			state[key] = reducer(subState, action);
		}

		return state;
	}
}

// Can be passed as 2nd param to createStore, to enhance dispatch functions with special middleware
// After that the middleware functions will be called before the regular dispatch whenever you call
// store.dispatch()
export function applyMiddleware(...fns) {

	// this is called by 'return enhancer(createStore)(reducer)' in createStore()
    return function(createStore) {

		// this fn returns the store with a store.dispatch method that is wrapped so it
		// calls the middleware functions before calling the regular dispatch()
        return function(reducer) {
            var store = createStore(reducer);
            var oldDispatch = store.dispatch;

			// start at the end of the fns array (middleware functions) and work backwards
			// this creates a function chain that will call logger() -> anyOtherMiddleware() -> dispatch()
            store.dispatch = fns.reduceRight(function(prev, curr) {
				return curr(store)(prev); // ie: dispatch = logger(store)(oldDispatch)
            }, oldDispatch)

            return store;
        }
    }
}
