import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import * as fetchJsonp from "fetch-jsonp";

@Injectable()
export class MainService {
  //private apiURL = './lib/apiconnect.php';  // if PHP support, use this file to handle
  private apiURL = 'https://sg.media-imdb.com/suggests/';  // URL to web API
  
  constructor() { }

  getMovies (term: string){
    
    // set up an instance of this class since inside a promise it cannot acces it via this
    let instance : MainService = this;
    
    // reshape the api url to imdb can accept it. Depends on search term and first char
    var url =  this.apiURL + term.charAt(0) + '/' + term.replace(/ /g, '_') + '.json';
    
    // call fetch-jsonp since imdb uses a custom callback function
    // The resource will timeout after duration of the timeout regardless. Need a fix
    var jsonresp = fetchJsonp(url, {
      jsonpCallbackFunction: 'imdb$' + term.replace(/ /g, '_'),
      timeout: 10000
    });
    return jsonresp.then(function(response) {
      return response.json();
    }).then(function(json) {
      
      // transform the json data from imdb into something usable
      return instance.cleanUp(json);
    }).catch(function(ex) {
      //instance.handleError(ex);
    });
  }
  private cleanUp(json: string) {
    var jsonData = JSON.stringify(json);
    
    // transform the jsonp data into a json object. Might be able to make it work with jsonp
    jsonData = jsonData.slice(jsonData.indexOf('['), -1);
    
    var replace = {
      '"l"':'"name"',
      '"i"': '"image"',
      'http:': 'https:',
      '"id"': '"url"',
      '"s"': '"stars"',
      '"y"': '"year"',
      ".jpg": ''
    };
    
    // replace the default names with names of movie values
    jsonData = jsonData.replace(/"l"|"i"|http:|"id"|"s"|"y"|.jpg/gi, function(matched){
      return replace[matched];
    });
    
    // parse the string into a json object
    return JSON.parse(jsonData);
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
