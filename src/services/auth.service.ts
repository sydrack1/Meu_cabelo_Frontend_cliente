import { LocalstorageService } from './localstorage.service';
import { LocalUserDTO } from './../models/local.user.dto';
import { API_CONFIG } from './../config/api.config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginWithEmailDTO } from '../models/login.with.email.dto';
import { LoginWithUsernameDTO } from '../models/login.with.username.dto';

@Injectable()
export class AuthService {

    constructor(public http: HttpClient, public storage: LocalstorageService) {}

    authenticateWithEmail(loginWithEmail: LoginWithEmailDTO) {
       return this.http.post(`${API_CONFIG.base_url}/user-client/auth`,
                        loginWithEmail,
                        {
                            observe: 'response',
                            responseType: 'json'
                        });
    }
    authenticateWithUsername(loginWithUsername: LoginWithUsernameDTO) {
        return this.http.post(`${API_CONFIG.base_url}/user-client/auth`,
                        loginWithUsername,
                        {
                            observe: 'response',
                            responseType: 'json'
                        });
    }
    logout() {
        this.storage.setLocalUser(null);
    }
    sucessfullAuthenticate(usr: object) {
        const user: LocalUserDTO = {
            user: usr
        };
        this.storage.setLocalUser(user);
    }

}
