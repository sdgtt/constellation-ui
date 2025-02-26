import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "./template/navbar/navbar.component";
import { FooterComponent } from "./template/footer/footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'constellation-ui';
}
