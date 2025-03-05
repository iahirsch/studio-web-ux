import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { filter, map, Observable } from 'rxjs';
import { BarService } from './services/bar/bar.service';
import { FooComponent } from './components/foo/foo.component';

@Component({
  imports: [AsyncPipe, RouterModule, FooComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private barService = inject(BarService);
  title = 'frontend';
  api$: Observable<string> = this.barService.api().pipe(
    map((res) => res.message),
    filter((message) => message.length > 4)
  );
}
