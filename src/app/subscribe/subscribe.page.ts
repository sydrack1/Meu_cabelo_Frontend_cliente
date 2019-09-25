import { Component, OnInit } from '@angular/core';
import { CreateDTO } from 'src/models/create.dto';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CreateService } from 'src/services/create.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.page.html',
  styleUrls: ['./subscribe.page.scss'],
})
export class SubscribePage implements OnInit {
  create: CreateDTO = {
    email: '',
    username: '',
    name: '',
    password: '',
    passwordConfirm: '',
    birthday: ''
  };
  constructor(
    public router: Router,
    public createService: CreateService,
    public loadingController: LoadingController,
    public toastController: ToastController
  ) {}
  isEmail(email) {
    let serchfind: boolean;
    // tslint:disable-next-line:max-line-length
    const regex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/igm);
    serchfind = regex.test(email);

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
  ngOnInit() {
  }

  async subscribe() {
    const loadingId = 'carregando';
    this.presentLoading(loadingId);
    if (this.isEmail(this.create.email)) {
      try {
        const response = await this.createService.createUser(this.create).toPromise();
        console.log(response);
        this.hideLoading(loadingId);
        this.router.navigate(['tabs/tab1']);
      } catch (e) {
        this.hideLoading(loadingId);
        this.presentToast(e);
      }
    } else {
      const e = {
        error: {
          error: 'Use um email real'
        }
      };
      try {
        this.hideLoading(loadingId);
        this.presentToast(e);
      } catch (e) {
       this.hideLoading(loadingId);
       this.presentToast(e);
      }
    }
  }
}
