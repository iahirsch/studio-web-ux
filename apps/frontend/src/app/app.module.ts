import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';

// In der App-Modul-Datei
@NgModule({
    providers: [
        provideHttpClient(),
        // andere Module
    ],
})
export class AppModule { }
