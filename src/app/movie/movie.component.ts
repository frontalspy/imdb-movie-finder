import { Component, OnInit } from '@angular/core';
import {Movie} from '../movie';
import {MainService} from '../main-service.service';
import {trigger, state, style, animate, transition} from '@angular/animations';

@Component({
  selector: 'movie',
  templateUrl: './movie.component.html',
  providers: [MainService],
  styleUrls: ['./movie.component.css'],
  animations: [
    trigger('fadeIn', [
      state('in', style({opacity: 1})),
      transition('void => *', [
        style({opacity: 0}),
        animate(1000)
      ]),
      transition('* => void', [
        animate(500, style({opacity: 0}))
      ])
    ])
  ]
})
export class MovieComponent implements OnInit {
  errorMessage: string;
  movies : string;
  constructor(private mainService: MainService) { }
  
  ngOnInit() {}
  
  getMovies(term: string){
    if(term && term.length != 0)
      this.mainService.getMovies(term).then(
                                        movies => { movies ? this.movies = movies : this.movies= null;},
                                        error => this.errorMessage = <any>error);
    else {
      this.movies = null;
    }
  }

}
