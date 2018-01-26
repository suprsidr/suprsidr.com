import React, {Component} from 'react';
import {Link} from 'react-router';

export default class Home extends Component {
  render() {
    return (
      <div className="row">
        <div className="small-12 columns text-center">
          <h2>Welcome to StuMan</h2>
          <h5>The Student Manager App</h5>
          <p><Link to="/students/" activeStyle={{ color: '#00d8ff' }}><img src="/img/home.png" alt="Students"/></Link></p>
        </div>
      </div>
    )
  }
}


