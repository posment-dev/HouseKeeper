import React from 'react';
import './App.css';

import TaskList from './components/TaskList';
import NavBar from './components/NavBar';

import { Route, Routes } from 'react-router-dom';
import { connect } from 'react-redux';

function App() {

  const Tasks = connect((state) => ({
    tasks: state.tasks,
    sortBy: state.sortBy,
    filter: state.filter,
    editModeTasks: state.editModeTasks,
    pauseInput: state.pauseInput,
    loading: state.loading,
  }))(TaskList);

  return (
    <div className="App">
      <header className="App-header">
        <NavBar />
      </header>
      <div className='App-body'>
        <Routes>
          <Route 
            exact path='/tasks'
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
