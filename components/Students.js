import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';

export default class Students extends Component {
  constructor (props) {
    super(props);
    this.state = {
      students: [],
      baseQuery: {},
      letter: ''
    };
    this.fields = {
      _id: -1
    };
  }
  
  componentDidMount() {
    this.setState({letter: this.props.params.letter && this.props.params.letter.toUpperCase() || 'A'},
      () => this.makeQuery(this.state.letter));
  }
  componentWillReceiveProps(nextProps) {
    this.setState({letter: nextProps.params.letter && nextProps.params.letter.toUpperCase() || 'A'},
      () => this.makeQuery(this.state.letter));
  }
  handleLetterClick(e) {
    e.preventDefault();
    browserHistory.push(`/students/${e.target.getAttribute('href')}`);
  }
  handleSelectChange(e) {
    e.preventDefault();
    browserHistory.push(`/students/${e.target.value}`);
  }
  handleStudentClick(e) {
    e.preventDefault();
    browserHistory.push(`/student/${e.target.getAttribute('href')}`);
  }
  makeQuery(letter) {
    let regex = new RegExp(`^${letter}`, 'i');
    let query = {
      "name.last": regex
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
      this.setState({students: data});
    });
  }
  
  render() {
    const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    return (
      <div>
        <div className="row">
          <div className="small-8 medium-7 small-centered columns">
            <ul className="pagination alphabet text-center show-for-medium" role="navigation" aria-label="Pagination">
              {letters.map((char, i) => (
                <li
                  className={this.state.letter === char ? 'current' : ''}
                  key={`${char}_${i}`}>
                  <a href={char} onClick={(e) => this.handleLetterClick(e)}>{char}</a>
                </li>)
              )}
            </ul>
            <select className="pagination text-center show-for-small-only" role="navigation" aria-label="Pagination" onChange={(e) => this.handleSelectChange(e)}>
              {letters.map((char, i) => <option value={char} key={`${char}_${i}`}>{char}</option>)}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="small-8 medium-7 small-centered columns">
            <ul className="student-list">
              {this.state.students.length === 0 && <li>Sorry, no results for {this.state.letter}.</li>}
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
      </div>
    )
  }
}
