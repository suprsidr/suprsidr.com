import React, {Component} from 'react';
import {render} from 'react-dom';
import minimongo from 'minimongo';
import Header from './Header';
import Footer from './Footer';
import {fetchData} from '../config/utils';

export default class Main extends Component {
  constructor (props) {
    super(props);
    this.state = {
      studentsLoaded: false
    };
    this.LocalDb = minimongo.MemoryDb;
    // Create local db (in memory database with no backing)
    this.db = new this.LocalDb();
  }
  componentWillMount() {
    // setup minimongo collection
    this.db.addCollection('students');
	  // check localStorage support
	  this.localStorageSupported = this.storageAvailable('localStorage');
  }
  componentDidMount() {
	  let data = this.localStorageSupported && JSON.parse(localStorage.getItem('studentData')) || null;
	  const now = Math.round(new Date().getTime() / 1000);
	  if(!data || (now - data.timeStamp) >= 900) {
		  fetchData({
			  /*modified: {$lt: Date.now()}*/
		  }, {}, (err, data) => {
			  if(err) {
				  console.log(err);
			  } else {
				  this.upsert(data);
			  }
		  });
	  } else {
		  this.upsert(data.students);
	  }
  }
	storageAvailable(type) {
		try {
			const storage = window[type],
					x = '__storage_test__';
			storage.setItem(x, x);
			storage.removeItem(x);
			return true;
		}
		catch(e) {
			return false;
		}
	}
	upsert(data) {
		// insert data into db as one big dump - Always use upsert for both inserts and modifies
		this.db.students.upsert(data, () => {
			console.log('data upserted');
			this.setState({studentsLoaded: true});
			this.localStorageSupported && localStorage.setItem('studentData', JSON.stringify({
				timeStamp: Math.round(new Date().getTime() / 1000),
				students: data
			}));
		});
	}
  render() {
    return (
      <div>
        <Header />
        <div className="main_content">
          {this.state.studentsLoaded && React.Children.map(this.props.children, (child) => React.cloneElement(child, { db: this.db }))}
        </div>
        <Footer />
      </div>
    )
  }
}
