import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {
  Router: Router;

  constructor(router:Router) {
    this.Router = router;
  }

  ngOnInit() {
  }

  OpenPolitics() {
    this.Router.navigate(['/catalog/pol']);
  }

  OpenBusiness() {
    this.Router.navigate(['/catalog/biz']);
  }

  OpenRandom() {
    this.Router.navigate(['/catalog/b']);

  }
}
