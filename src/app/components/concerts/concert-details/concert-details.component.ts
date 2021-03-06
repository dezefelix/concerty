import {Component, OnInit} from '@angular/core';
import {ConcertService} from '../../../_services/concert.service';
import {Concert} from '../../../_models/concert.model';
import {ActivatedRoute} from '@angular/router';
import {Venue} from '../../../_enums/venue.enum';
import {ArtistService} from '../../../_services/artist.service';
import {DateHelper} from '../../../_helpers/date-helper';

@Component({
  selector: 'app-concert-details',
  templateUrl: './concert-details.component.html',
  styleUrls: ['./concert-details.component.scss']
})
export class ConcertDetailsComponent implements OnInit {
  Venue = Venue;
  concert: Concert;
  isUpcoming: boolean;

  constructor(private concertService: ConcertService,
              private artistService: ArtistService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        const _id = params.key;
        this.concert = this.concertService.getConcert(_id);
        this.isUpcoming = DateHelper.isUpcoming(this.concert.date);
      });
  }
}
