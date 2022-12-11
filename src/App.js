import React from 'react';
import logo from './logo.svg';
import './App.css';

import TaskList from './components/TaskList';

import { Route, Routes } from 'react-router-dom';
import { connect } from 'react-redux';

function App() {

  const Tasks = connect((state) => ({
    tasks: state.tasks,
    loading: state.loading,
  }))(TaskList);

  return (
    <div className="App">
      <div className='App-body'>
        <Routes>
          <Route 
            exact path='/'
            element={
              <Tasks />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
