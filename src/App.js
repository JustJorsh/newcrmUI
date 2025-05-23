import React from 'react';
import { Provider } from 'react-redux';
import store, { persistor } from './redux/store';
import { BrowserRouter as Router } from 'react-router-dom';
import Views from './views';
import { Route, Switch } from 'react-router-dom';
import { PersistGate } from 'redux-persist/lib/integration/react';

function App() {
  return (
    <div className='App'>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <Router>
            <Switch>
              <Route path='/' component={Views} />
            </Switch>
          </Router>
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
