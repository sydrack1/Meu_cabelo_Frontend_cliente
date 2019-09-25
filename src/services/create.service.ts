import { LocalstorageService } from './localstorage.service';
import { LocalUserDTO } from './../models/local.user.dto';
import { API_CONFIG } from './../config/api.config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateDTO } from '../models/create.dto';

@Injectable()
export class CreateService {
    constructor(public http: HttpClient, public storage: LocalstorageService) { }

    createUser(createModel: CreateDTO) {
        return this.http.post(
            `${API_CONFIG.base_url}/user-client/create`,
            createModel,
            {
                observe: 'response',
                responseType: 'json'
            });
    }
    sucessfullAuthenticate(usr: object) {
        const user: LocalUserDTO = {
            user: usr
        };
        this.storage.setLocalUser(user);
    }
}
