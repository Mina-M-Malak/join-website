import { Component, OnInit } from '@angular/core';
import { Clups } from '../../models/clups';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-home-clups',
  templateUrl: './home-clups.component.html',
  styleUrls: ['./home-clups.component.scss']
})
export class HomeClupsComponent implements OnInit {

  clups:Clups[]=[]

  constructor(public homeService:HomeService) { }

  ngOnInit(): void {
    this.homeService.clups.subscribe((res) => {
      if(Array.isArray(res)) {
        this.clups=[...this.clups,...res]
      }
    })
  }

}