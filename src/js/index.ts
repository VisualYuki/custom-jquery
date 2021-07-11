import '@less/site-main.less';

import {$} from './jquery';

declare global {
	interface Window {
		$: Function;
	}
}

window.$ = $;

//$.ajax({
//	url: 'http://jsonplaceholder.typicode.com/users1212',
//	method: 'GET',
//	//"data": {
//	//	"userId": "1"
//	//},
//	success: (data: string) => {
//		console.log('in success');
//		console.log(data);
//	},
//	error: (data: string) => {
//		console.log('in error');
//		console.log(data);
//	},
//});
