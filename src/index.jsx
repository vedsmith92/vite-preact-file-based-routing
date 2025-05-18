import { render } from 'preact';
import { Suspense } from 'preact/compat';
import { lazy, LocationProvider, Router, Route } from 'preact-iso';

import './style.css'


const pageFiles = import.meta.glob('./pages/**/*.jsx');
const pageKeys = Object.keys(pageFiles).sort()
const pages = Array(pageKeys.length).fill({}).map((_, i) => ({
	fileKey: pageKeys[i],
	path: pageKeys[i].replace(/^.\/pages/, '').replace(/\.[^.]+$/, '').replace(/^\/index$/, '/').replace(/(\/index)+$/, '').replace(/\[(.*?)\]/g, ':$1'),
}))


const App = () => {
	return (
		<LocationProvider>
			<main>
				<a href="/">Index</a><br />
				<a href="/user/a">User A</a><br />
				<a href="/user/a/1">User A + Post 1</a><br />
				&nbsp;<bn />
				<Suspense fallback={<>Loading..</>}>
					<Router>
						{
							pages.map((page, index) => (
								<Route
									path={ page.path }
									component={ lazy(() => pageFiles[page.fileKey]()) }
									// component={ lazy(() => import(page.fileKey)) }
								/>
							))
						}
					</Router>
				</Suspense>
			</main>
		</LocationProvider>
	);
}


render(<App />, document.getElementById('app'));
