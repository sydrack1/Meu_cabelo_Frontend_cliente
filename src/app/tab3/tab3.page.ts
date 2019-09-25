import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free/ngx';
import { Platform } from '@ionic/angular';
import { LocalstorageService } from './../../services/localstorage.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  userCreate: any;
  user: any;
  constructor(
    public router: Router,
    public localstorageService: LocalstorageService,
    public admobFree: AdMobFree,
    public platform: Platform
    ) {
      this.platform.ready()
      .then(() => {
        this.onLoadAdBanner();
        this.onLoadAdInterstitial();
      });
    }

  ngOnInit() {
   this.userCreate = this.localstorageService.getLocalUser();
   const {user} = this.userCreate;
   this.user = {
     user
   };
  }
  onLoadAdInterstitial() {
    const interstitialConfig: AdMobFreeInterstitialConfig = {
      id: 'ca-app-pub-3940256099942544/1033173712',
      isTesting: true,
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
      id: 'ca-app-pub-3940256099942544/6300978111',
      isTesting: true,
      autoShow: true
      };
     this.admobFree.banner.config(bannerConfig);

     this.admobFree.banner.prepare()
      .then(() => {
         this.admobFree.banner.show();
      })
      .catch(e => console.log(e));
  }
}
