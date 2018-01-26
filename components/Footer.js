import React, {Component} from 'react';

export default class Footer extends Component {
  render() {
    return (
      <footer className="row">
        <div className="small-6 columns">
          © 2016 Wayne Patterson<br />
	        Fork me on <a href="https://github.com/suprsidr/technical-review">Github</a>
        </div>
        <div className="small-6 columns text-right">
	        <a className="react-link" href="https://facebook.github.io/react/"><h4>Built with
			        <img width="24" height="24" src="/img/react-logo.svg"/>
			        React
		        </h4></a>
        </div>
      </footer>
    )
  }
}
