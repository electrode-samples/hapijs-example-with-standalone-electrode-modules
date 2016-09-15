import React from 'react';
import { Router, Route } from 'react-router';
import StargazersContainer from './containers/StargazersContainer';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import CSRF from './components/csrf';

/**
 * The React Routes for both the server and the client.
 */
module.exports = (
	<Router>
		<Route component={StargazersContainer}>
			<Route component={Header}>
				<Route path="/" component={Home} />
				<Route path="/about" component={About} />
				<Route path="/csrf" component={CSRF} />
			</Route>
		</Route>
	</Router>
);
