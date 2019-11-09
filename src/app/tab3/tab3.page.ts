import { File } from '@ionic-native/file/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free/ngx';
import { Platform } from '@ionic/angular';
import { LocalstorageService } from './../../services/localstorage.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  userCreate: any;
  downloadUrlFromLocalstorage: any;
  user: any;
  public downloadUrl: Observable<string>;
  constructor(
    public router: Router,
    public localstorageService: LocalstorageService,
    public admobFree: AdMobFree,
    public platform: Platform,
    public camera: Camera,
    public file: File,
    public afStorage: AngularFireStorage
    ) {
      this.platform.ready()
      .then(() => {
        this.onLoadAdBanner();
        this.onLoadAdInterstitial();
        console.log('entrou ads');
      });
    }

  ngOnInit() {
    this.userCreate = this.localstorageService.getLocalUser();
    const {user} = this.userCreate;
    this.user = {
      user
    };
    this.downloadUrlFromLocalstorage = this.localstorageService.getPictureProfileUrl();
    const imagem = document.getElementsByClassName('photo-profile');
    if (this.downloadUrlFromLocalstorage === null) {
      imagem[1].setAttribute('src', '../../assets/img/user.png');
    } else {
      console.log(this.downloadUrlFromLocalstorage);
      imagem[1].setAttribute('src', this.downloadUrlFromLocalstorage);
      imagem[1].src = '';
      console.log('photo init');
    }
  }

  onLoadAdInterstitial() {
    const interstitialConfig: AdMobFreeInterstitialConfig = {
      id: 'ca-app-pub-2541357222578629/3568661452',
      isTesting: false,
      autoShow: true
      };
    this.admobFree.interstitial.config(interstitialConfig);
    this.admobFree.interstitial.prepare()
      .then(() => {
         this.admobFree.interstitial.show();
      })
      .catch(e => console.log(e));
  }

  onLoadAdBanner() {
     const bannerConfig: AdMobFreeBannerConfig = {
      id: 'ca-app-pub-2541357222578629/6723655445',
      isTesting: false,
      autoShow: true
      };
     this.admobFree.banner.config(bannerConfig);

     this.admobFree.banner.prepare()
      .then(() => {
         this.admobFree.banner.show();
      })
      .catch(e => console.log(e));
  }

  onClickEditProfile() {
    this.platform.ready()
      .then(() => {
        this.onLoadAdInterstitial();
    });
    this.router.navigate(['/login']);
  }

  async onClickChangePicture() {

    this.platform.ready()
      .then(() => {
        this.onLoadAdInterstitial();
    });
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    };
    try {
      const fileUri: string = await this.camera.getPicture(options);
      console.log(`FileURI: ${fileUri}`);
      let file: string;

      if (this.platform.is('ios')) {
        file = fileUri.split('/').pop();
        console.log(`File: ${file}`);
      } else {
        file = fileUri.substring(fileUri.lastIndexOf('/') + 1, fileUri.lastIndexOf('?'));
        console.log(`File: ${file}`);
      }

      const path: string = fileUri.substring(0, fileUri.lastIndexOf('/'));
      console.log(`Path: ${path}`);
      const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, file);
      const blob: Blob = new Blob([buffer]);
      console.log(buffer , blob);
      this.uploadPicture(blob);
      const imagem = document.getElementsByClassName('photo-profile');
      // tslint:disable-next-line:max-line-length
      const urlImage = `https://firebasestorage.googleapis.com/v0/b/meu-cabelo.appspot.com/o/${this.userCreate.user.user._id}%2Fimage.jpg?alt=media`;
      this.localstorageService.setPictureProfileUrl(urlImage);
    } catch (e) {
      console.log(e);
    }
    this.router.navigate(['/login']);
  }

  async onClickChangePictureCamera() {

    this.platform.ready()
      .then(() => {
        this.onLoadAdInterstitial();
    });
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    };
    try {
      const fileUri: string = await this.camera.getPicture(options);
      console.log(`FileURI: ${fileUri}`);
      let file: string;

      if (this.platform.is('ios')) {
        file = fileUri.split('/').pop();
        console.log(`File: ${file}`);
      } else {
        file = fileUri.split('/').pop();
        console.log(`File: ${file}`);
      }

      const path: string = fileUri.substring(0, fileUri.lastIndexOf('/'));
      console.log(`Path: ${path}`);
      const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, file);
      const blob: Blob = new Blob([buffer]);
      console.log(buffer , blob);
      this.uploadPicture(blob);
      const imagem = document.getElementsByClassName('photo-profile');
      // tslint:disable-next-line:max-line-length
      const urlImage = `https://firebasestorage.googleapis.com/v0/b/meu-cabelo.appspot.com/o/${this.userCreate.user.user._id}%2Fimage.jpg?alt=media`;
      this.localstorageService.setPictureProfileUrl(urlImage);
    } catch (e) {
      console.log(e);
    }
    this.router.navigate(['/login']);
  }

  uploadPicture(blob: Blob) {
    const ref = this.afStorage.ref(`${this.userCreate.user.user._id}/image.jpg`);
    const task = ref.put(blob);

    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadUrl = ref.getDownloadURL();
      })
    )
    .subscribe();
  }
}
