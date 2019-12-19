import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserLogin } from 'models';
import { AuthenticationService } from '../../services/index';
import { NzMessageService } from 'ng-zorro-antd';

/**
 * Connecte un utilisateur à la plateforme
 */
@Component({
    selector: 'login',
    templateUrl: 'login.html'
})
export class LoginComponent {
    model = new UserLogin();
    failed = false;
    constructor(
        private authService: AuthenticationService,
        private messageService: NzMessageService,
        private router: Router
    ) { }

    async login() {
        this.failed = false;
        try {
            // TODO utiliser authService en async/await pour authentifier l'utilisateur
            // TODO redirection sur "/"
            const value = await this.authService.authenticate(this.model);
            this.router.navigate(['/']);
        }
        catch (e) {
            this.messageService.create('error','Connexion failed ! Username ou mot de passe invalide...');
            return this.failed = true;
        }
    }
}
