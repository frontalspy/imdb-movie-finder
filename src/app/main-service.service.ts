import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions, Jsonp, URLSearchParams } from '@angular/http';

import * as fetchJsonp from "fetch-jsonp";

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class MainService {
  private apiURL = './lib/apiconnect.php';  // if PHP support, use this file to handle
  //private apiURL = 'http://sg.media-imdb.com/suggests/';  // URL to web API
  private searchTerm = "";
  
  constructor(private jsonp: Jsonp) { }

  getMovies (term: string){
    // Use this for direct connection to imdb. Comment out if using php
    //var url = this.remoteURL(this.apiURL, term);
    
    let params = new URLSearchParams();
    params.set('search', term); // the user's search value
    params.set('format', 'json');
    params.set('callback', 'JSONP_CALLBACK');
    return this.jsonp.get(this.apiURL, { search: params })
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private remoteURL(url: string, term: string) {
    // reshape the api url to imdb can accept it. Depends on search term and first char
    url += term.charAt(0) + '/' + term.replace(/ /g, '_') + '.json';
    
    // call fetch-jsonp since imdb uses a custom callback function
    var jsonresp = fetchJsonp(url, {
      jsonpCallbackFunction: 'imdb$' + term,
      timeout: 1000
    })
    jsonresp.then(function(response) {
      return response.json()
    }).then(function(json) {
      // transform the json data from imdb into something usable
      var jsonData = "";
      jsonData = JSON.stringify(json);
      jsonData = 'imdb$' + term + '('+ jsonData.slice(jsonData.indexOf('"d":'), -1) + '})';
      var replace = {
        '"l"':'"name"',
        '"i"': '"image"',
        '"id"': '"url"',
        '"s"': '"stars"',
        '"y"': '"year"',
        ".jpg": ''
      };
      // replace the default names with names of movie values
      jsonData = jsonData.replace(/"l"|"i"|"id"|"s"|"y"|.jpg/gi, function(matched){
        return replace[matched];
      });
    }).catch(function(ex) {
        console.log('Oops', ex)
    });
    // Need to find a way to return the transformed JSON. 
    return jsonresp;
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
