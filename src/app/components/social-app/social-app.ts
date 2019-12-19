import { Component, OnInit, EventEmitter } from '@angular/core';
import { Channel } from 'models';
import { ChannelService, PostSocketService } from 'services';
import { ActivatedRoute, Router} from '@angular/router';

/**
 * Display the channel list, the social feed and the notification bar for logged users.
 * Affiche la liste des channels sur la gauche, les posts au centre, et une barre de notifications sur la gauche
 */
@Component({
    selector: 'social-app',
    templateUrl: 'social-app.html'
})
export class SocialAppComponent implements OnInit {
    channels: Channel[] = [];

    constructor(
        private channelService: ChannelService,
        private postSocket: PostSocketService,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    async ngOnInit() {
        try{
            await this.channelService.getAll().then((channels)=> this.channels = channels).then(()=>console.log(this.channels));
        this.postSocket.onNewChannel( () => this.channelService.getAll().then((channels)=> this.channels = channels));
        //this.route.firstChild.params permet de connaître les paramètre de l'url
       
            if (this.channels.length >0)
                 this.router.navigate(['/channel/'+this.channels[0].id]);

        }catch (e) {
            //this.messageService.create('info','Welcome ! Let's create first channel');
            console.log("Channel vide");
        }
        
    }
}
