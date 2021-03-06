import {Component, OnInit} from '@angular/core';
import {Artist} from '../../../_models/artist.model';
import {ArtistService} from '../../../_services/artist.service';
import * as $ from 'jquery';
import * as UIkit from 'uikit';

@Component({
  selector: 'app-artist-management',
  templateUrl: './artist-management.component.html',
  styleUrls: ['./artist-management.component.scss']
})
export class ArtistManagementComponent implements OnInit {
  artists: Artist[] = [];
  selectedArtist: Artist = null;
  selectedArtistIndex: number = null;

  constructor(private artistService: ArtistService) {
  }

  ngOnInit() {
    this.artistService.artistsSub
      .subscribe(artists => this.artists = artists);
  }

  artistSelected(artist: Artist): void {
    this.selectedArtist = artist;
    this.selectedArtistIndex = this.artists.indexOf(this.selectedArtist);

    // Tiny delay to smoothen accordion animation.
    setTimeout(() => {
      this.toggleAccordionSections();
    }, 10);
  }

  editArtistCanceled(): void {
    this.selectedArtist = null;
  }

  private toggleAccordionSections(): void {
    const accordionElement = $('.uk-accordion')[0];
    const newComponentClassName = accordionElement.children[1].className;
    const editComponentClassName = accordionElement.children[2].className;

    if (newComponentClassName === 'uk-open') {
      UIkit.accordion(accordionElement).toggle(1);
    }

    if (editComponentClassName != 'uk-open') {
      UIkit.accordion(accordionElement).toggle(2);
    }
  }
}
