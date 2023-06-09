import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/screens/auth/services/auth.service';
import  firebase from 'firebase/compat/app'
import 'firebase/firestore'
import 'firebase/auth'
import {AngularFireAuth} from '@angular/fire/compat/auth'
@Component({
  selector: 'app-profile-data',
  templateUrl: './profile-data.component.html',
  styleUrls: ['./profile-data.component.scss']
})
export class ProfileDataComponent implements OnInit {
  areas:any[]=[]
  profilForm:FormGroup=new FormGroup({})
  submited:boolean=false
  loading:boolean=false
  intervalLoading=false
  counter=60
  setIntervalVariable:any
  showVerificationpopup=false
  verifiedCodeControl:any = new FormControl('',[Validators.required,Validators.pattern(/^\d{6}$/)])
  captchaVerifier:any
  verificationId:any
  verifyoading=false
  counterId=1
  oldmobile=''
  constructor(private authService:AuthService,
    private toastr:ToastrService,
    private fb:FormBuilder) { }
    getOtp() {
      if(!this.intervalLoading) {
        this.loading=true
        this.counterId+=1
        let child = document.createElement('div')
        child.setAttribute('id',`captchaid${this.counterId}`)
        child.setAttribute('class','d-none')
        document.body.appendChild(child)
        this.captchaVerifier = new firebase.auth.RecaptchaVerifier(`captchaid${this.counterId}`,{size:'invisible'})
        firebase.auth().signInWithPhoneNumber(this.profilForm.value?.mobile?.e164Number,this.captchaVerifier).then((res) => {
         
          this.showVerificationpopup=true
          this.verificationId = res?.verificationId
          this.loading=false
          this.counterToEnable()
        }).catch((err) => {
          if(err?.message=='reCAPTCHA has already been rendered in this element') {
            this.getOtp()
          } else {
            this.toastr.error(err?.message || 'Something wnt wrong')
            this.loading = false
          }
      
        })
      }
           }
           counterToEnable() {
            if(!this.intervalLoading) {
              this.counter=60
              this.intervalLoading=true
             this.setIntervalVariable = setInterval(() => {
                this.counter-=1
                if(this.counter==0) {
                  this.counter=60
                  clearInterval(this.setIntervalVariable)
                  this.intervalLoading=false
                }
              },1000)
            }
          }
  ngOnInit(): void {    
    firebase.initializeApp({
      apiKey: "AIzaSyBspMnWz9iq5Evt11YwGkcEPqghHyIGwuo",
      authDomain: "joinapp-515e6.firebaseapp.com",
      databaseURL: "https://joinapp-515e6.firebaseio.com",
      projectId: "joinapp-515e6",
      storageBucket: "joinapp-515e6.appspot.com",
      messagingSenderId: "794053292456",
      appId: "1:794053292456:web:36878b6a9a02cff3"
    })
    this.returnsignupForm()
    this.authService.userProfile.subscribe((res:any)=>{
 
      this.profilForm.patchValue({
        fname:res?.fname,
        lname:res?.lname,
        mobile:res?.mobile,
        // newmobile:res?.mobile,
        dob:res?.dob,
        area_id:res?.area_id,
        email:res?.email,
        gender:res?.gender,
      })
      this.oldmobile=res?.mobile
    })

    this.authService.areas.subscribe(
      (res:any) => {
        this.areas=res
      }
    )
  }
  returnsignupForm() {
    return this.profilForm = this.fb.group({
      fname:['',Validators.required],
      lname:['',Validators.required],
      mobile:['',Validators.required],
      dob:['',Validators.required],
      area_id:[''],
      gender:['',Validators.required],
      email:['',[Validators.required,Validators.email]],
    })
  }
  dateInputType(value:any) {
    if(!value.value) {
      value.type='text'
      value.blur()
    }

  }
  updateProfile(formvalue:any) {
   
    this.submited=true
    if(this.profilForm.valid) {
      //this.profilForm.value?.mobile?.number != this.oldmobile
    if(false) {
      if(!this.intervalLoading) {
        this.getOtp()
      } else {
        this.showVerificationpopup=true 
      }
    } else {
      this.loading=true
      formvalue.mobile=this.oldmobile
     // delete formvalue.newmobile
      this.authService.updateUserProfile(formvalue).subscribe(
        res=> {
         
          this.loading=false
          if(res?.code==1) {
            this.toastr.success(res?.message);
            this.authService.getUserProfile()
          } else {
            
          }
        }
      )
    }

    }
  }
  get lang()  {
    return localStorage.getItem('lang') || 'en'
  }
  verifyCode() {
    if(this.verificationId) {
      this.verifyoading=true
      let credentials  = firebase.auth.PhoneAuthProvider.credential(
        this.verificationId,
        this.verifiedCodeControl?.value
      )
      firebase.auth().signInWithCredential(credentials).then(
        res =>  {
          this.verifyoading=false
          this.loading=true
          let mobile = this.profilForm.get('mobile')?.value.e164Number.replace(this.profilForm.get('mobile')?.value.dialCode,'')
          this.profilForm.patchValue({
            mobile:mobile
          })
          let value = this.profilForm.value
        //  delete value.newmobile
          this.authService.updateUserProfile(value).subscribe(
            res=> {
             
              this.loading=false
              if(res?.code==1) {
                this.toastr.success(res?.message);
              //  window.location.reload();
              } else {
              //  for(let i = 1 ; i < this.counterId ; i++ ) {
              //   console.log(    document.getElementById(`captchaid${this.counterId}`))
              //   document.getElementById(`captchaid${this.counterId}`).remove()
              //  }
              }
            } ,err => {
          
            }
          )
    

        }
      ).catch((err) => {
        if(err?.message=='Firebase: The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure to use the verification code provided by the user. (auth/invalid-verification-code).') {
          this.toastr.error(localStorage.getItem('lang')=='ar' ? 'هذا الرمز  غير صحيح' : 'Invalid Code') 
        } else {
          this.toastr.error(err?.message||'Something wnt wrong') 
        }
        this.verifyoading=false 
      })
    }
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    //console.log(    document.getElementById(`captchaid${this.counterId}`))
//    document.getElementById(`captchaid${this.counterId}`).remove()
  }
}
