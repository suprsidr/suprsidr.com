import React, {Component} from 'react';
import {NEW_PROFILE_IMAGE_URL} from '../config/globals';
import {browserHistory} from 'react-router';
import {insertRemoteData, updateLocalStorage} from '../config/utils';

export default class NewStudent extends Component {
  constructor (props) {
    super(props);
    this.state = {
      firstName: 'New',
      lastName: 'User'
    };
  }
  handleKeyUp(e) {
    e.preventDefault();
    switch(e.target.id) {
      case 'name.first':
        this.setState({firstName: e.target.value});
        break;
      case 'name.last':
        this.setState({lastName: e.target.value});
        break;
    }
  }
  handleSaveClick(e) {
    e.preventDefault();
    const form = document.querySelector('#new-form');
    const inputs = Array.from(form.querySelectorAll('input'));
  
    const obj = inputs.reduce((prev, next) => {
      var arr = next.id.split('.');
      if(arr.length > 1) {
        try{
          prev[arr[0]][arr[1]] = next.value;
        } catch(e) {
          prev[arr[0]] = {};
          prev[arr[0]][arr[1]] = next.value;
        }
      } else {
        prev[next.id] = next.value;
      }
      return prev;
    }, {});
    console.log(obj);
    this.sendData(obj);
  }
  sendData(obj) {
    // TODO need to get our admin username for this POST
    insertRemoteData({
      admin: 'Joe Friday',
      student: obj
    }, (err, data) => {
      if(err) {
        console.log('error', err);
        return;
      }
      if(data) {
        this.props.db.students.upsert(data, (res) => {
          console.log('upsert result', res);
          // update local storage
          updateLocalStorage(this.props.db);
          const char = this.state.lastName.charAt(0);
          browserHistory.push(`/students/${char}#${data.sid}`);
        }, () => console.log('an error ocurred'))
      } else {
        console.log('no remote insert performed');
      }
    
    })
  }
  render() {
    return (
      <div className="row">
        <div className="small-12 columns text-center">
          <div className="card">
            <div className="top text-center">
              <img className="student-image-large" src={NEW_PROFILE_IMAGE_URL} alt="New User"/>
              <h2 className="text-center">{`${this.state.firstName} ${this.state.lastName}`}</h2>
            </div>
            <div ref="content" className="content">
              <div className="slide">
                <div className="small-12 columns text-left">
                  <form id="new-form">
                    <div className="row">
                      <div className="small-12 columns medium-10 large-8 medium-centered">
                        <div className="row">
                          <div className="small-12 medium-6 columns">
                            <label>First Name: <input type="text" id="name.first" defaultValue="" required onKeyUp={(e) => this.handleKeyUp(e)}/></label>
                          </div>
                          <div className="small-12 medium-6 columns">
                            <label>Last Name: <input type="text" id="name.last" defaultValue="" required onKeyUp={(e) => this.handleKeyUp(e)}/></label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="small-12 medium-6 columns">
                            <label>DOB: <input type="text" id="dob" defaultValue="" required placeholder="01/15/1990"/></label>
                          </div>
                          <div className="small-12 medium-6 columns">
                            <label>Image: <input type="text" id="picture.large" defaultValue={NEW_PROFILE_IMAGE_URL} required/></label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="small-12 medium-6 columns">
                            <label>Street: <input type="text" id="location.street" defaultValue="" required/></label>
                          </div>
                          <div className="small-12 medium-6 columns">
                            <label>City: <input type="text" id="location.city" defaultValue="" required/></label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="small-6 columns">
                            <label>State: <input type="text" id="location.state" defaultValue="" required/></label>
                          </div>
                          <div className="small-6 columns">
                            <label>Postal Code: <input type="text" id="location.postcode" defaultValue="" required/></label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="small-6 columns">
                            <label>Phone: <input type="tel" id="phone" defaultValue="" required/></label></div>
                          <div className="small-6 columns">
                            <label>Cell: <input type="tel" id="cell" defaultValue="" required/></label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="small-12 columns">
                            <label>Email: <input type="email" id="email" defaultValue="" required/></label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="small-12 medium-6 columns">
                            <label>Major: <input type="text" id="major" defaultValue="" required/></label>
                          </div>
                          <div className="small-12 medium-6 columns">
                            <label>GPA: <input type="text" id="gpa" defaultValue="" required/></label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="action">
              <a className="button success" href="Save" onClick={(e) => this.handleSaveClick(e)}>Save</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
