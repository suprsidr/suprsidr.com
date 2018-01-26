import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {updateRemoteData, updateLocalStorage, deleteRemoteData} from '../config/utils';

export default class Student extends Component {
  constructor (props) {
    super(props);
    this.state = {
      students: [],
      baseQuery: {},
      editing: false
    };
    this.fields = {};
  }
  componentDidMount() {
    this.makeQuery(this.props.params.id);
  }
  componentWillReceiveProps(nextProps) {
    this.makeQuery(nextProps.params.id);
  }
  handleEditClick(e) {
    e.preventDefault();
    this.toggleEditing();
  }
  handleSaveClick(e) {
    e.preventDefault();
    const form = document.querySelector('#edit-form');
    const inputs = Array.from(form.querySelectorAll('input'));
  
    const obj = inputs.reduce((prev, next) => {
      //console.log(next.id, next.value);
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
    //console.log(obj);
    this.sendData(obj);
  }
  handleDeleteClick(e) {
    e.preventDefault();
    // TODO add confirm msg
    const char = this.state.students[0].name.last.charAt(0);
    deleteRemoteData({sid: this.state.students[0].sid}, (err, res) => {
      if(err) {
        console.log(err);
        return;
      }
      if(res) {
        this.props.db.students.remove(this.state.students[0]._id, () => {
          console.log('item removed');
          updateLocalStorage(this.props.db);
          browserHistory.push(`/students/${char}`);
        }, () => console.log('an error ocurred'))
      } else {
        console.log('no remote delete performed');
      }
    })
  }
  toggleEditing() {
    this.setState({editing: !this.state.editing}, () => {
      this.state.editing && this.refs.content.classList.add('slide-left');
      !this.state.editing && this.refs.content.classList.remove('slide-left');
    });
  }
  makeQuery(id) {
    let query = {
      "sid": id
    };
    this.setState({baseQuery: query}, () => this.query(query, {
      limit: 0,
      sort: {},
      fields: this.fields
    }));
    
  }
  query(q, p) {
    this.props.db.students.find(q, p).fetch((data) => {
      this.setState({students: data});
    });
  }
  sendData(obj) {
    // TODO need to get our admin username for this POST
    updateRemoteData({
      admin: 'Joe Friday',
      student: obj
    }, (err, data) => {
      if(err) {
        console.log('error', err);
        return;
      }
      if(data) {
        // add our mongo _id to our data
        data._id = this.state.students[0]._id;
        this.props.db.students.upsert(data, (res) => {
          console.log('upsert result', res);
          this.makeQuery(data.sid);
          // update local storage
          updateLocalStorage(this.props.db);
          this.toggleEditing();
        }, () => console.log('an error ocurred'))
      } else {
        console.log('no remote update performed');
      }
    
    })
  }
  render() {
    return (
      <div className="row">
        <div className="small-12 columns text-center">
          {this.state.students && this.state.students.map((student, i) => ( <div key={student.sid} className="card">
            <div className="top text-center">
              <img className="student-image-large" src={`${student.picture.large}`} alt={`${student.name.last} ${student.name.first}`}/>
              <h2 className="text-center">{`${student.name.first} ${student.name.last}`}</h2>
            </div>
            <div ref="content" className="content">
              <div className="slide">
                <div className="small-12 columns">
                  <p>{student.location.street}<br />{student.location.city}, {student.location.state} {student.location.postcode}</p>
                  <p>Phone: {student.phone} <br className="show-for-small-only"/> Cell: {student.cell}</p>
                  <p>Email: {student.email}</p>
                  <p>Major: {student.major}</p>
                  <p>GPA: {student.gpa}</p>
                  <p>DOB: {`${new Date(student.dob).toLocaleDateString()}`}</p>
                  <p>{`Registered: ${new Date(student.registered).toLocaleDateString()}`}</p>
                  <p>&nbsp;</p>
                  <p>Last updated: <span className="grey-text">{new Date(student.modified).toUTCString()}</span></p>
                  <p>Modified by: <span className="grey-text">{student.modifiedby}</span></p>
                  <p>ID: <span className="grey-text">{student.sid}</span></p>
                </div>
                <div className="small-12 columns text-left">
                  <form id="edit-form">
                    <div className="row">
                      <div className="small-12 columns medium-10 large-8 medium-centered">
                        <div className="row">
                          <div className="small-12 medium-6 columns">
                            <label>First Name: <input type="text" id="name.first" defaultValue={student.name.first}/></label>
                          </div>
                          <div className="small-12 medium-6 columns">
                            <label>Last Name: <input type="text" id="name.last" defaultValue={student.name.last}/></label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="small-12 medium-6 columns">
                            <label>Street: <input type="text" id="location.street" defaultValue={student.location.street}/></label>
                          </div>
                          <div className="small-12 medium-6 columns">
                            <label>City: <input type="text" id="location.city" defaultValue={student.location.city}/></label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="small-6 columns">
                            <label>State: <input type="text" id="location.state" defaultValue={student.location.state}/></label>
                          </div>
                          <div className="small-6 columns">
                            <label>Postal Code: <input type="text" id="location.postcode" defaultValue={student.location.postcode}/></label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="small-6 columns">
                            <label>Phone: <input type="tel" id="phone" defaultValue={student.phone}/></label></div>
                          <div className="small-6 columns">
                            <label>Cell: <input type="tel" id="cell" defaultValue={student.cell}/></label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="small-12 medium-6 columns">
                            <label>Email: <input type="email" id="email" defaultValue={student.email}/></label>
                          </div>
                          <div className="small-12 medium-6 columns">
                            <label>Image: <input type="text" id="picture.large" defaultValue={student.picture.large}/></label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="small-12 medium-6 columns">
                            <label>Major: <input type="text" id="major" defaultValue={student.major}/></label>
                          </div>
                          <div className="small-12 medium-6 columns">
                            <label>GPA: <input type="text" id="gpa" defaultValue={student.gpa}/></label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <input id="sid" type="hidden" defaultValue={student.sid}/>
                  </form>
                </div>
              </div>
            </div>
            <div className="action">
              <a className="button primary" href="Edit" onClick={(e) => this.handleEditClick(e)}>Edit</a>&nbsp;
              {this.state.editing ?
                <a className="button success" href="Save" onClick={(e) => this.handleSaveClick(e)}>Save</a> :
                <a className="button alert" href="Delete" onClick={(e) => this.handleDeleteClick(e)}>Delete</a>}
            </div>
          </div>)
          )}
        </div>
      </div>
    )
  }
}
