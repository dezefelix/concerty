import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Genre} from '../../../../_enums/genre.enum';

@Component({
  selector: 'app-new-artist',
  templateUrl: './new-artist.component.html',
  styleUrls: ['./new-artist.component.scss']
})
export class NewArtistComponent implements OnInit {
  form: FormGroup;
  Genre = Genre;
  genres = Genre.keys();

  constructor() { }

  ngOnInit() {
    this.initializeForm();
  }

  createArtist(): void {

  }

  cancel() {
    this.initializeForm();
  }

  formInteractedWithAndInvalid(): boolean {
    for (const c in this.form.controls) {
      const control = this.form.get(c);

      // For all controls, except <select><option>
      if (control.dirty && !control.pristine && control.invalid) {
        return true;
      }

      // For <select><option>
      if (c === 'genre') {
        return control.touched && control.value === null;
      }
    }
    return false;
  }

  private initializeForm() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      biography: new FormControl(null, [
        Validators.required,
        Validators.maxLength(500)
      ]),
      genre: new FormControl(null, Validators.required)
    })
  }
}
