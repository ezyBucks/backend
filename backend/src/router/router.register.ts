import UserRoutes from './user.router';
import AuthRoutes from './auth.router';
import { Application } from 'express';

/**
 * Register all of the functions defined in the getRoutes function
 * 
 * @param {Application} The express appplication
 */
export default function registerFunctions(app: Application) {
	const routesToRegister = getRoutes();

	routesToRegister.forEach((route: any) => {
		let newRoute = new route("", app)
	})
}

/**
 * Gets the routes to register
 * 
 * @return {any[]}
 */
function getRoutes(): any[] {
	return [
		UserRoutes,
		AuthRoutes
	];
}
