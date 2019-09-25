import { LocalUserDTO } from './../models/local.user.dto';
import { Injectable } from '@angular/core';
import { STORAGE_KEYS } from 'src/config/localstorage.keys.config';

@Injectable()
export class LocalstorageService {

    getLocalUser() {
        const user = localStorage.getItem(STORAGE_KEYS.localUser);
        if (user === null) {
            return null;
        } else {
            return JSON.parse(user);
        }
    }
    setLocalUser(obj: LocalUserDTO) {
        if (obj === null) {
            localStorage.removeItem(STORAGE_KEYS.localUser);
        } else {
            localStorage.setItem(STORAGE_KEYS.localUser, JSON.stringify(obj));
        }
    }
}
