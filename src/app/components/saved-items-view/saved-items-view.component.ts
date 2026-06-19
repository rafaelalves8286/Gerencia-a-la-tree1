import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../services/menu.service';
import { MenuTemplate } from '../../models/menu-item.model';

@Component({
  selector: 'app-saved-items-view',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './saved-items-view.component.html',
  styleUrls: ['./saved-items-view.component.scss']
})
export class SavedItemsViewComponent {
  menu = inject(MenuService);
  searchQuery = signal('');

  get filtered(): MenuTemplate[] {
    const q = this.searchQuery().toLowerCase().trim();
    return this.menu.savedTemplates().filter(t => t.name.toLowerCase().includes(q));
  }

  get query() { return this.searchQuery(); }
  set query(v: string) { this.searchQuery.set(v); }

  loadTemplate(t: MenuTemplate) {
    this.menu.loadTemplateIntoForm(t);
  }

  deleteTemplate(event: Event, index: number) {
    event.stopPropagation();
    this.menu.deleteTemplate(index);
  }

  formatPrice(price: number): string {
    return price.toFixed(2).replace('.', ',');
  }
}
