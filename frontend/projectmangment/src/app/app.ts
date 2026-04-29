import { Component, signal } from '@angular/core';
import { RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { TEXTSHOME } from './constants/texts-home';

@Component({ 
  selector: 'app-root',
  imports: [RouterOutlet,RouterLinkWithHref],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  texts = TEXTSHOME;
  
}
