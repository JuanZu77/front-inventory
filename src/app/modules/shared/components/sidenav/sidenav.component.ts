import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, inject } from '@angular/core';
import { error } from 'console';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit{

  mobileQuery: MediaQueryList;
  
  private keycloakService = inject(KeycloakService);
  username:any|undefined;
  email:any|undefined;

  menuNav = [
    {name: "Home", route:"home", icon:"home"},
    {name: "Categorías", route:"category", icon:"category"},
    {name: "Productos", route:"product", icon:"production_quantity_limits"},
  ];

  constructor(media:MediaMatcher){
    this.mobileQuery = media.matchMedia('{max-width: 600px}');
  }

  async ngOnInit(): Promise<void> {
    this.checkLogin();
  }

//CHECK if the user is logged in
  private async checkLogin(): Promise<void> {
    const isLoggedIn = this.keycloakService.isLoggedIn();
    
      if (isLoggedIn) {
        this.username = this.keycloakService.getUsername();
        this.loadUserProfile();
      }
    }

//GET USER EMAIL
  private loadUserProfile(): void {
    this.keycloakService.loadUserProfile().then((profile: KeycloakProfile) => {
      this.email = profile.email;
    }).catch((err: any) => {
      console.error('Failed to load user profile', err);
    });
  }

//LOGOUT
  logout(){
    this.keycloakService.logout();

  }
}
