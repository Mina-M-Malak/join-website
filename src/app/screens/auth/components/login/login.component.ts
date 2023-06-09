import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService, login } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {Auth, FacebookAuthProvider, GoogleAuthProvider} from "firebase/auth" ;
import {AngularFireAuth } from '@angular/fire/compat/auth' ;
import { NotificationsService } from 'src/app/screens/notifications/services/notifications.service';
import { MembersService } from 'src/app/screens/members/services/members.service';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  showpopup=false
  loginForm : FormGroup=new FormGroup({})
  submited:boolean=false
  loading:boolean=false
  app: FirebaseApp;
  user: any;
  unsubscribe :Subscription
  constructor(private authService:AuthService,
    private authServiceAbstract: SocialAuthService,
    private angularFireAuth: AngularFireAuth,
    private notficationsService:NotificationsService,
    private membersservice:MembersService,
    private router:Router,
    private toastr:ToastrService,
    private fb:FormBuilder) { }

  ngOnInit(): void {
   this.unsubscribe =  this.authServiceAbstract.authState.subscribe((user) => {
        if(user) {
          this.user = user;
          this.loading=true
          let loginData:any = user
          let email = user?.email
          let body:any = {}
          if(user?.provider=='GOOGLE') body.google_id=loginData?.id
          else if(user?.provider=='FACEBOOK') body.facebook_id=loginData?.id
         
          this.authService.logIn(body).subscribe(
            res => {
              this.loading=false
              if(res?.code==1) {
            //    this.toastr.success(res?.message);
                localStorage.removeItem('joincart')
                localStorage.setItem('joinToken',res?.payload?.auth_token)
                this.authService.getUserProfile()
         //       this.notficationsService.getNotifications()
                this.membersservice.getAllMembers()
                this.router.navigate(['/'])
              } else {
                this.router.navigate(['/auth/signup'],{queryParams : {
                  id:loginData?.id,
                  family_name:loginData?.lastName, 
                  given_name:loginData?.firstName,
                  email:email||'user@gmail.com',
                  type:user?.provider=='GOOGLE'?1:2
                }})
              }
              if(user)this.authServiceAbstract.signOut()
            }
          )
        }
    });
    // this.authServiceAbstract.authState.subscribe((user) => {
    //   this.user = user;
    //   console.log(user);
    // });
    this.app = initializeApp({
      apiKey: "AIzaSyBspMnWz9iq5Evt11YwGkcEPqghHyIGwuo",
      authDomain: "joinapp-515e6.firebaseapp.com",
      databaseURL: "https://joinapp-515e6.firebaseio.com",
      projectId: "joinapp-515e6",
      storageBucket: "joinapp-515e6.appspot.com",
      messagingSenderId: "794053292456",
      appId: "1:794053292456:web:36878b6a9a02cff3"
    });
    this.loginForm = this.fb.group({
      mobile : ['',Validators.required],
      password : ['',Validators.required]
    })
  }
  signInWithFB(): void {
    this.authServiceAbstract.signIn(FacebookLoginProvider.PROVIDER_ID)
  }
  signInWithGoogle(): void {
    this.authServiceAbstract.signIn(GoogleLoginProvider.PROVIDER_ID)
  }

  login(formValue:any) {
   this.submited=true
   if(this.loginForm.valid) {
    let value = {
      password:formValue?.password,
      mobile:formValue?.mobile?.e164Number.replace(formValue?.mobile?.dialCode,''),
    }
    this.loading=true
      this.authService.logIn(value).subscribe(
        res => {
          this.loading=false
          if(res?.code==1) {
            // this.toastr.success(res?.message);
            localStorage.removeItem('joincart')
            localStorage.setItem('joinToken',res?.payload?.auth_token)
            this.notficationsService.getNotifications()
            this.membersservice.getAllMembers()
            this.authService.getUserProfile()
            this.router.navigate(['/'])
          } else {
            this.toastr.error(res?.message,'', {
              timeOut: 7000,
            })
          }
        }
      )
   }
  }
  get lang() {return localStorage.getItem('lang')||'en'}
  // GoogleAuth() {
  //   return this.AuthLogin(new GoogleAuthProvider(),1);
  // }
  // facebookAuth() {
  //   return this.AuthLogin(new FacebookAuthProvider(),2);
  // }
  // Auth logic to run auth providers
  AuthLogin() {
  

  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

    
    if(this.unsubscribe)this.unsubscribe.unsubscribe()
    
  }
}
