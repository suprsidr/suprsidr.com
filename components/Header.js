import React, {Component} from 'react';
import {Link, IndexLink, browserHistory} from 'react-router';
import {
		ResponsiveNavigation,
		TopBarTitle,
		TopBarLeft,
		TopBarRight,
		Menu,
		MenuItem
} from 'react-foundation';

class Header extends Component {
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    document.querySelector('.title-bar-title').innerHTML = document.querySelector('.top-bar-title').innerHTML;
    this.menuItems = Array.from(document.querySelectorAll('.navbar .menu a'));
    this.menuItems.forEach((item) => {
      item.addEventListener('click', () => this.handleMenuItemClick(), false);
    })
  }
  handleMenuItemClick() {
    if(document.querySelector('.title-bar.hide')) {
      return;
    } else {
      document.querySelector('.menu-icon').click();
    }
  }
	handleSubmit(e) {
		e.preventDefault();
		const val = this.refs.search.value || '';
    browserHistory.push(`/search/${val}`);
    this.handleMenuItemClick();
	}
	handleKeyup(e) {
		const code = (typeof e.which === 'number') ? e.which : e.keyCode;
		if(code === 13) {
			this.handleSubmit(e);
		}
	}
  render() {
    return (
	    <ResponsiveNavigation className="navbar">
		    <TopBarTitle>
          <IndexLink to="/">StuMan</IndexLink></TopBarTitle>
		    <TopBarLeft>
			    <Menu>
				    <MenuItem><Link to="/students" activeStyle={{ color: '#00d8ff' }}>Students</Link></MenuItem>
            <MenuItem><Link to="/new" activeStyle={{ color: '#00d8ff' }}>New</Link></MenuItem>
			    </Menu>
		    </TopBarLeft>
		    <TopBarRight>
			    <Menu>
				    <MenuItem>
					    <input ref="search" type="search" placeholder="Search" onKeyUp={(e) => this.handleKeyup(e)} />
				    </MenuItem>
				    <MenuItem>
					    <button type="button" className="button" onClick={(e) => this.handleSubmit(e)}>Search</button>
				    </MenuItem>
			    </Menu>
		    </TopBarRight>
	    </ResponsiveNavigation>
    )
  }
}

export default Header;
