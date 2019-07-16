// https://github.com/vipinkrishna

import React, { Component } from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import {Provider, connect} from 'react-redux'
import thunk from 'redux-thunk'
import './index.scss'


//INITIAL STATE
const initialState = {
  department: null,
  employee: null,
  departments: ["HR", "ENGINEERS"],
  hrs: [1,2,3,4,5],
  engineers: [6,7,8,9],
  list: [1,2,3,4,5],
  data: null,
  showDetails: false
}

//REDUCER
const reducer = function(state=initialState, {type, payload}) {
  const newState = {...state}
  switch(type) {
    case "UPDATE_DEPARTMENT_AND_EMPLOYEE":
      return {...state, ...payload}
    case "UPDATE_DEPARTMENT":
      return {...state, ...payload}
    case "UPDATE_EMPLOYEE":
      return {...state, ...payload}
    case "UPDATE_DATA":
      return {...state, ...payload}
    case "CLEAR":
      return {...state, ...payload}
    default: 
      return newState
  }
}


//MIDDLEWARE
const middleware = [thunk]


//STORE
const store = createStore(reducer, applyMiddleware(...middleware))


//APP
class App extends Component {

  render() {

    const list = this.props.list && this.props.list.map(id => {
      return <option key={id} value={id}>{id}</option>
    })

    const departments = this.props.departments && this.props.departments.map(dept => {
      return <option key={dept} value={dept}>{dept}</option>
    })

    const details = <>
      <img src={this.props.data && this.props.data.avatar}/>
      <div><strong>ID: </strong>{this.props.data && this.props.data.id}</div>
      <div>{this.props.data && this.props.data.first_name + " "}{this.props.data && this.props.data.last_name}</div>
    </>

    return (
      <Provider store={store}>
        <div className="Input">
          <div>
            <select onChange={this.props.handleDepartmentChange}>
              {departments}
            </select>
          </div>
          <div>
            <select onChange={this.props.handleEmployeeIdChange}>
              {list}
            </select>
          </div>

          <div>
              <button onClick={() => this.props.handleShowDetails(`https://reqres.in/api/users/${this.props.employee}`)}>Show Details</button>
          </div>
          <div>
              <button onClick={this.props.handleClear}>Clear</button>
          </div>
        </div>

        <div className="Output">
          {this.props.showDetails && details}
        </div>
      </Provider>
    )
  }

  componentDidMount() {
    this.props.adjustUI(this.props.departments[0], this.props.list[0])
  }
}

const adjustUI = (department, employee) => {
  return {type: "UPDATE_DEPARTMENT_AND_EMPLOYEE", payload: {department, employee}}
}

const handleDepartmentChange = (e) => (dispatch, getState) => {
    const value = e.target.value
    const state = getState()
    if(value === "HR") {
        dispatch({type: "UPDATE_DEPARTMENT", payload: {list: state.hrs, department: value, employee: state.hrs[0]}})
    } else {
        dispatch({type: "UPDATE_DEPARTMENT", payload: {list: state.engineers, department: value, employee: state.engineers[0]}})
    }
}

const handleEmployeeIdChange = (e) => {
  const value = e.target.value
  return {type: "UPDATE_EMPLOYEE", payload: {employee: value}}
}

const handleClear = () => {
  return {type: "CLEAR", payload: {hrs: null, engineers: null, list: null, departments: null, department: null, employee: null, showDetails: false}}
}


//ASYNC ACTION
const handleShowDetails = (url) => (dispatch, getState) => {
  const state = getState()
  if(state.employee){
    fetch(url)
      .then(res => res.json())
      .then(data => {
        dispatch({type: "UPDATE_DATA", payload: {data: data.data, showDetails: true}})
      })
  }
}


//MAP STATE TO PROPS
const mapStateToProps = (state) => ({
  department: state.department,
  employee: state.employee,
  departments: state.departments,
  hrs: state.hrs,
  engineers: state.engineers,
  list: state.list,
  data: state.data,
  showDetails: state.showDetails
})


//MAP DISPATCH TO PROPS
const mapDispatchToProps = {
  handleDepartmentChange: handleDepartmentChange,
  handleEmployeeIdChange: handleEmployeeIdChange,
  handleShowDetails: (url) => handleShowDetails(url),
  handleClear: handleClear,
  adjustUI: adjustUI
}


//CONNECT
const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)
const reduxApp = (
  <Provider store={store}>
    <ConnectedApp/>
  </Provider>
)
render(reduxApp, document.getElementById('root'));
