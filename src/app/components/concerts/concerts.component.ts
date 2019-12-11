import { Component, OnInit } from '@angular/core';
import {Concert} from '../../_models/concert.mode';
import {ConcertService} from '../../_services/concert.service';

@Component({
  selector: 'app-concerts',
  templateUrl: './concerts.component.html',
  styleUrls: ['./concerts.component.scss']
})
export class ConcertsComponent implements OnInit {
  concerts: Concert[] = [];

  constructor(private concertService: ConcertService) { }

  ngOnInit() {
    this.concertService.getConcerts()
      .subscribe(concerts => this.concerts = concerts);
  }

}
