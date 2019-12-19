import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { LoggedUser } from './User';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  windowsVisible: boolean = true;
  notificationsSubject = new Subject<any[]>();
  notifications : any[] = [
    {
      text : "Welcome "+this.user.username+" !",
      url : '#'
    }
    ,];

  constructor(
    private user: LoggedUser,
    private messageService: NzMessageService,
    private router: Router) { 
      document.addEventListener(
        "visibilitychange"
        , () => { 
          if (document.hidden) { 
            this.windowsVisible = false;
          }else{
            this.windowsVisible = true;
          }
        }
      );
    }

  emitNotificationSubject() {
    this.notificationsSubject.next(this.notifications.slice());
  }

  newNotification(notif: any){
    this.notifications.push(notif);
    this.messageService.create('info',notif.text);
    //console.log("fenetre visible : " , this.windowsVisible);
    if(!this.windowsVisible)
      this.webNotify(notif);
    
    this.emitNotificationSubject();
  }

  webNotify(notif: any) {
      if (!("Notification" in window)) {
        alert("Ce navigateur ne supporte pas les notifications desktop");
      }
      // Voyons si l'utilisateur est OK pour recevoir des notifications
      else if (Notification.permission === "granted") {
        let notification = new Notification(notif.text);
        notification.onclick = (e) => {
          e.preventDefault();
          this.router.navigate([`/channel/${notif.url}`]);
        }
      }
    
      // Sinon, nous avons besoin de la permission de l'utilisateur
      // Donc, nous devons vérifier s'il n'y a pas 'denied' à la place de 'default'
      else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
          // Quelque soit la réponse de l'utilisateur, nous nous assurons de stocker cette information
          if(!('permission' in Notification)) {
            Notification.permission = permission;
          }
    
          // Si l'utilisateur est OK, on crée une notification
          if (permission === "granted") {
            let notification = new Notification(notif.text);
          }
        });
      }
    
      // Comme ça, si l'utlisateur a refusé toute notification, et que vous respectez ce choix,
      // il n'y a pas besoin de l'ennuyer à nouveau.
  }


}
