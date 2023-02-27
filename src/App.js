import React from 'react';
import './App.css';

import TaskList from './components/TaskList';
import NavBar from './components/NavBar';
import BudgetTable from './components/BudgetTable';
import ChooseCat from './components/ChooseCategory';
import SetDefaultCategory from './components/SetDefaultCategory';
import BudgetFileUpload from './components/BudgetFileUpload';
import BudgetTotalsView from './components/BudgetTotalsView';
import BudgetEntriesView from './components/BudgetEntriesView';

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

  const Budget = connect((state) => ({
    entries: state.entries,
    dateRange: state.dateRange,
    totals: state.totals,
    selectedEntries: state.selectedEntries,
  }))(BudgetTable)

  const Cats = connect((state) => ({
    categories: state.categories,
    selectedEntries: state.selectedEntries,
  }))(ChooseCat)

  const Default = connect((state) => ({
    selectedEntries: state.selectedEntries,
  }))(SetDefaultCategory)

  const Totals = connect((state) => ({
    dateRange: state.dateRange,
    totals: state.totals,
  }))(BudgetTotalsView)

  const Entries = connect((state) => ({
    entries: state.entries,
    dateRange: state.dateRange,
    selectedEntries: state.selectedEntries,
  }))(BudgetEntriesView)

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
          <Route 
            exact path='/budget'
            element={
              <Budget />
            }
          />
          <Route 
            exact path='/budget/totals'
            element={
              <Totals />
            }
          />
          <Route 
            exact path='/budget/entries'
            element={
              <Entries />
            }
          />
          <Route 
            exact path='/budget/categories'
            element={
              <Cats />
            }
          />
          <Route 
            exact path='/budget/categories/default'
            element={
              <Default />
            }
          />
          <Route 
            exact path='/budget/fileupload'
            element={
              <BudgetFileUpload />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
