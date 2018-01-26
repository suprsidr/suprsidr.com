import React from 'react';
import Home from '../components/Home';
import Search from '../components/Search';
import Main from '../components/Main';
import NewStudent from '../components/NewStudent';
import Student from '../components/Student';
import Students from '../components/Students';
import {NotFound} from '../components/NotFound';
import {Route, IndexRoute} from 'react-router';

export default (
  <Route path="/" component={Main}>
    <Route path="/students(/:letter)" component={Students} />
    <Route path="/student/:id" component={Student} />
    <Route path="/new" component={NewStudent} />
    <Route path="/search(/:searchTerm)" component={Search} />
	  <Route path="*" component={NotFound}/>
    <IndexRoute component={Home} />
  </Route>
);
