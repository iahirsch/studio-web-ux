import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-ojp-search',
    templateUrl: './ojp-search.component.html',
})
export class OjpSearchComponent {
    @Output() search = new EventEmitter<{ from: string; to: string }>();

    onSearch() {
        const searchData = { from: 'Berlin', to: 'Munich' };
        this.search.emit(searchData); // Sende ein korrektes Objekt
    }
}