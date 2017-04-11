import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions, Jsonp, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class MainService {
  private apiURL = 'http://localhost/movie-finder/src/lib/apiconnect.php';  // URL to web API
  //private apiURL = 'http://sg.media-imdb.com/suggests/';  // URL to web API
// + term.charAt(0) + '/' + term.replace(/ /g, '_') + '.json'
  
  constructor(private jsonp: Jsonp) { }

  getMovies (term: string){
    let params = new URLSearchParams();
    params.set('search', term); // the user's search value
    params.set('format', 'json');
    params.set('callback', 'JSONP_CALLBACK');
    return this.jsonp.get(this.apiURL, { search: params })
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.d || { };
  }

  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return errMsg;
  }
}
