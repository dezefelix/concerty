import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Venue} from '../../../../_enums/venue.enum';
import {ConcertService} from '../../../../_services/concert.service';
import {Concert} from '../../../../_models/concert.mode';

@Component({
  selector: 'app-new-concert',
  templateUrl: './new-concert.component.html',
  styleUrls: ['./new-concert.component.scss']
})
export class NewConcertComponent implements OnInit {
  Venue = Venue;
  venues = Venue.keys();
  form: FormGroup;

  constructor(private concertService: ConcertService) { }

  ngOnInit() {
    this.initializeForm();
  }

  createConcert(): void {
    const input = this.form.value;
    const concert: Concert = new Concert(input.title, input.venue, input.date,
      input.tickets, input.price, input.description);
    this.concertService.createConcert(concert);
    this.initializeForm();
  }

  cancel() {
    this.initializeForm();
  }

  markDatepickerAsTouched(): void {
    this.form.controls['date'].markAsTouched();
  }

  setDateValue(date: Date): void {
    this.form.get('date').setValue(date);
  }

  formInteractedWithAndInvalid(): boolean {
    for (const c in this.form.controls) {
      const control = this.form.get(c);

      // For all controls, except <select><option>
      if (control.dirty && !control.pristine && control.invalid) {
        return true;
      }

      // For <select><option>
      if (c === 'venue' && control.touched && control.value === null) {
        return true;
      }

      // For <mat-datepicker>
      if (c === 'date' && control.touched && control.invalid) {
        return true;
      }
    }

    return false;
  }

  private initializeForm() {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      venue: new FormControl(null, Validators.required),
      tickets: new FormControl(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(1000000),
      ]),
      date: new FormControl(null, Validators.required),
      price: new FormControl(null, [
        Validators.required,
        Validators.min(0.01),
        Validators.max(1000000),
      ]),
      description: new FormControl(null, [
        Validators.required,
        Validators.maxLength(500)
      ])
    })
  }
}
