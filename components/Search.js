import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';


export default class Search extends Component {
  constructor (props) {
    super(props);
    this.state = {
      students: [],
      baseQuery: {},
      searchTerm: ''
    };
  }
  componentDidMount() {
    this.setState({searchTerm: this.props.params.searchTerm || 'StuMan'}, () => {
      this.makeQuery(this.state.searchTerm);
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({searchTerm: nextProps.params.searchTerm || 'StuMan', students: []}, () => {
      this.makeQuery(this.state.searchTerm);
    });
  }
  handleStudentClick(e) {
    e.preventDefault();
    browserHistory.push(`/student/${e.target.getAttribute('href')}`);
  }
  makeQuery(searchTerm) {
    let regex = new RegExp(`${searchTerm}`, 'gi');
    let query = {
      $or: [
        {
          "name.first": regex
        },
        {
          "name.last": regex
        }
      ]
    };
    this.setState({baseQuery: query}, () => this.query(query, {
      limit: 0,
      sort: {
        "name.last":1,
        "name.first":1
      },
      fields: this.fields
    }));
    
  }
  query(q, p) {
    this.props.db.students.find(q, p).fetch((data) => {
      if(data.length === 1) {
        browserHistory.push(`/student/${data[0].sid}`);
      } else {
        this.setState({students: data});
      }
    });
  }
  render() {
    return (
      <div className="row">
        <div className="small-8 medium-7 small-centered columns">
          <ul className="student-list">
            {this.state.students.length === 0 && <li>Sorry, no results for {this.state.searchTerm}.</li>}
            {this.state.students && this.state.students.map((student) => (
              <li key={student.sid} id={student.sid}>
                <Link to={`/student/${student.sid}`}>
                  <img className="student-image-small float-left" src={`${student.picture.large}`} alt={`${student.name.last} ${student.name.first}`}/>
                  {`${student.name.last} ${student.name.first}`}
                </Link>
              </li>))
            }
          </ul>
        </div>
      </div>
    )
  }
}
