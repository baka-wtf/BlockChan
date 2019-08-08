import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { IndImmConfigService } from '../ind-imm-config.service';
import {MatSlideToggle} from '@angular/material';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {
  router: Router;
  Config: IndImmConfigService

  constructor(rtr: Router, config: IndImmConfigService) {
    this.router = rtr;
    this.Config = config;
  }

  public viewUpload() {
    this.router.navigate(['/upload']);
  }

  public viewViewPortal() {
    this.router.navigate(['/viewPortal']);
  }

  public viewBoards() {
    this.router.navigate(['/boards']);
  }
  ngOnInit() {
  }

}
