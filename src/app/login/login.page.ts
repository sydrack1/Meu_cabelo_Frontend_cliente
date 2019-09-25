import { AuthService } from './../../services/auth.service';
import { LoginWithEmailDTO } from './../../models/login.with.email.dto';
import { LoginWithUsernameDTO } from './../../models/login.with.username.dto';
import { Component, OnInit } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [Network]
})
export class LoginPage implements OnInit {
  login: any = {
    emailOrUsername: '',
    password: ''
  };
  loginWithEmail: LoginWithEmailDTO = {
    email: '',
    password: ''
  };
  loginWithUsername: LoginWithUsernameDTO = {
    username: '',
    password: ''
  };
  public loading = false;
  public loader: any;

  constructor(
    public router: Router,
    public auth: AuthService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public network: Network
  ) { }

  ngOnInit() {
  }
  isEmail(email) {
    let serchfind: boolean;
    // tslint:disable-next-line:max-line-length
    const regex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/igm);
    serchfind = regex.test(email);
    // /(?:"haircuts":[\[\]{}]"[\[\]{}]?)(.*?)(?:")[\[\]{}]?(.),/g
    return serchfind;
  }
  async presentToast(response) {
    const toast = await this.toastController.create({
      message: response.error.error,
      duration: 1000,
      color: 'secondary'
    });
    toast.present();
  }
  async presentLoading(loadingId: string) {
    const loading = await this.loadingController.create({
      message: 'Por favor, aguarde.',
      id: loadingId
    });
    await loading.present();
  }
  async hideLoading(loadingId: string) {
    await this.loadingController.dismiss(null, null, loadingId);
  }
  async enter() {
    const loadingId = 'carregando';
    this.presentLoading(loadingId);
    const rgx = new RegExp(/("haircuts":\[.*\],)/g);
    if (this.isEmail(this.login.emailOrUsername)) {
      this.loginWithEmail.email = this.login.emailOrUsername;
      this.loginWithEmail.password = this.login.password;
      try {
        const response = await this.auth.authenticateWithEmail(this.loginWithEmail).toPromise();
        this.loading = true;
        const responseObject = JSON.stringify(response.body).replace(rgx, '');
        const responseObj = JSON.parse(responseObject);
        this.auth.sucessfullAuthenticate(responseObj);
        this.hideLoading(loadingId);
        this.router.navigate(['tabs/tab1']);
      } catch (e) {
        console.log(e);
        this.hideLoading(loadingId);
        this.presentToast(e);
      }
    } else {
      this.loginWithUsername.username = this.login.emailOrUsername;
      this.loginWithUsername.password = this.login.password;
      try {
        const response = await this.auth.authenticateWithUsername(this.loginWithUsername).toPromise();
        const responseObject = JSON.stringify(response.body).replace(rgx, '');
        const responseObj = JSON.parse(responseObject);
        this.auth.sucessfullAuthenticate(responseObj);
        this.hideLoading(loadingId);
        this.router.navigate(['tabs/tab1']);
      } catch (e) {
        console.log(e);
        this.hideLoading(loadingId);
        this.presentToast(e);
      }
    }
  }
}
