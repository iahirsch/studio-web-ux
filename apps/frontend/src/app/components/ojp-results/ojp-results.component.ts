import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-ojp-results',
    templateUrl: './ojp-results.component.html',
})
export class OjpResultsComponent {
    @Input() connections: any[] = [];
}