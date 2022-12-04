import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/screens/auth/services/auth.service';
import { GlopalService } from 'src/app/services/glopal.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],

})
export class NavbarComponent implements OnInit {
  openNavbar:boolean=false
  currentLang:string=''
  hidenave:boolean=false
  userName=''
  filterPopup=false
  constructor(
    private authService:AuthService,
    private glopalService:GlopalService,
    private router:Router,
    public  translateService:TranslateService){
    this.currentLang=localStorage.getItem('lang') || 'en'
    this.translateService.use(this.currentLang)
    if(this.currentLang=='ar') {
      document.body.classList.add("custom-rtl")
    }
    else  {
      document.body.classList.remove("custom-rtl")
    }
  }
  isLogin():boolean {
    return !!localStorage.getItem("joinToken")
  }
  selectLang(lang:string) {
    location.reload()
    this.translateService.use(lang)
    if(lang=='ar') {
     document.body.classList.add("custom-rtl")
    }
    else  {
     document.body.classList.remove("custom-rtl")
    }
   localStorage.setItem('lang',lang)
 
  }
  get  lang() {
   return localStorage.getItem('lang') || 'en'
 }

  ngOnInit(): void {
    this.userName.toUpperCase
    this.authService.userProfile.subscribe((res:any)=>{
      if(res) {
        this.userName = `${res?.fname.slice(0,1)}${res?.lname.slice(0,1)}`
      }
    })
    this.glopalService.hideNavbarAndFooter.subscribe(
      res=> {
        this.hidenave=res
      }
    )
  }
  inputSearch(value:string) {
    if(value.trim().length>0) {
      this.router.navigate([`/search/${value}`])
    }
  }

}