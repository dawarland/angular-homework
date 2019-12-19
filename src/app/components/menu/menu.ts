import { Component, Input } from '@angular/core';
import { Channel } from 'models';
import { AuthenticationService, ChannelService, LoggedUser } from '../../services/index';

/**
 * Side menu permettant de naviguer entre les différents channels
 */
@Component({
    selector: 'menu',
    templateUrl: 'menu.html'
})
export class MenuComponent {
    @Input() channels: Channel[] = [];
    profilImg: string;
    constructor(
        private authService: AuthenticationService,
        private user: LoggedUser
    ){
        if(user.pictureUrl != '')
            this.profilImg=user.pictureUrl;
        this.profilImg='https://cdn.jobs.game/template/anonyme.jpg';
    }

    logout(){
        this.authService.logout();
    }
}