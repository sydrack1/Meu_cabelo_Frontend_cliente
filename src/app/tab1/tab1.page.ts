import { LocalstorageService } from './../../services/localstorage.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  constructor(
    public router: Router,
    public localstorageService: LocalstorageService
  ) {}

  ngOnInit() {
    if (this.localstorageService.getLocalUser() !== null) {

    } else {
      this.router.navigate(['/login']);
    }
  }
}
