import { Component, OnInit } from '@angular/core';
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
      this.mainService.getMovies(term).then(
                                        movies => { this.movies = movies},
                                        error => this.errorMessage = <any>error);
    else {
      this.movies = null;
      console.log(this.movies);
    }
  }

}
