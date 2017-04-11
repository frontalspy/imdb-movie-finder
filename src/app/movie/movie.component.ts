import { Component, OnInit } from '@angular/core';
import { Observable }       from 'rxjs/Observable';
import {Movie} from '../movie';
import {MainService} from '../main-service.service';

@Component({
  selector: 'movie',
  templateUrl: './movie.component.html',
  providers: [MainService],
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  errorMessage: string;
  movies : string;
  constructor(private mainService: MainService) { }

  ngOnInit() {}
  
  getMovies(term: string){
    if(term)
      this.mainService.getMovies(term).subscribe(
                                        movies => { this.movies = movies },
                                        error => this.errorMessage = <any>error);
  }

}
