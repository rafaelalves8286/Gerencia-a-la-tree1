import { Component, inject } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { ListViewComponent } from './components/list-view/list-view.component';
import { FormViewComponent } from './components/form-view/form-view.component';
import { SavedItemsViewComponent } from './components/saved-items-view/saved-items-view.component';
import { ModuloNavComponent } from './components/modulo-nav/modulo-nav.component';
import { AdminViewComponent } from './components/admin-view/admin-view.component';
import { EstoqueViewComponent } from './components/estoque-view/estoque-view.component';
import { FornecedoresViewComponent } from './components/fornecedores-view/fornecedores-view.component';
import { MenuService } from './services/menu.service';
import { NavegacaoService } from './services/navegacao.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    ListViewComponent,
    FormViewComponent,
    SavedItemsViewComponent,
    ModuloNavComponent,
    AdminViewComponent,
    EstoqueViewComponent,
    FornecedoresViewComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  menu = inject(MenuService);
  nav = inject(NavegacaoService);
}
