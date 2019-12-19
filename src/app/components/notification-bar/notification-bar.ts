import { Component, OnInit } from '@angular/core';
import { NotificationService, PostSocketService } from 'services';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'notification-bar',
    templateUrl: 'notification-bar.html'
})
export class NotificationBarComponent implements OnInit {

    notifications: any[];
    notificationSubscription: Subscription;

    constructor( 
        private postSocket: PostSocketService,
        private notifService: NotificationService
    ) { }

    ngOnInit() {
        this.notificationSubscription = this.notifService.notificationsSubject.subscribe(
            (notifications: any[]) => {
              this.notifications = notifications;
            }
          );

        this.postSocket.onPost((post) => {
            this.notifService.newNotification(
                {
                    text: 'New Post from '+post.user.username+' in "'+post.channel.name+'" channel !',
                    url: post.channel.id

                }
            );
        } );
        this.postSocket.onUserConnect((user) => {this.notifService.newNotification(
            {
                text: user.username +' is connected !',
                url: "#"
            }
        ) });
        this.postSocket.onNewChannel((channel) => {this.notifService.newNotification(
            {
                text: 'New Channel "'+channel.name+'" was created !',
                url: channel.id
            }
        )});
        this.postSocket.onComment((comment) => {this.notifService.newNotification(
            {
                text: comment.post.user.username+' commented the post of '+comment.post.user.username+' in "'+comment.post.channel.name+'" channel!',
                url: comment.post.channel.id
            }
        )});  
        this.postSocket.onLike((like) => {this.notifService.newNotification(
            {
                text: like.user.username+ ' like the post of '+like.post.user.username,
                url: like.post.channel.id
            }
        )});  


        this.notifService.emitNotificationSubject();
    }


}
