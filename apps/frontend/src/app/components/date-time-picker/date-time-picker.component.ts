import { Component, ElementRef, OnInit, output, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-time-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './date-time-picker.component.html',
  styleUrl: './date-time-picker.component.css'
})
export class DateTimePickerComponent implements OnInit, AfterViewInit {
  dateTimeSelected = output<Date>();
  
  // Referenzen auf die scroll-Container
  @ViewChild('dateWheel') dateWheelRef!: ElementRef;
  @ViewChild('hourWheel') hourWheelRef!: ElementRef;
  @ViewChild('minuteWheel') minuteWheelRef!: ElementRef;
  
  // Grundlegende Eigenschaften
  selectedDate = '';
  selectedTime = '';
  selectedDateFormatted = '';
  selectedDateIndex = 0;
  selectedHourIndex = 0;
  selectedMinuteIndex = 0;
  
  // UI-Status
  isPickerVisible = false;
  isArrivalMode = false;
  availableDates: Date[] = [];
  availableHours: string[] = []; // Stunden (00-23)
  availableMinutes: string[] = []; // Minuten (00, 05, 10, ..., 55)
  
  // Scroll-Hilfsvariablen
  private dateScrollTimeout: ReturnType<typeof setTimeout> | null = null;
  private hourScrollTimeout: ReturnType<typeof setTimeout> | null = null;
  private minuteScrollTimeout: ReturnType<typeof setTimeout> | null = null;
  private itemHeight = 40; // ungefähre Höhe eines Listenelementes
  
  ngOnInit() {
    // Initialisierung mit aktuellem Datum und Uhrzeit
    const now = new Date();
    this.selectedDate = this.formatDateForInput(now);
    this.selectedTime = this.formatTimeForInput(now);
    this.selectedDateFormatted = this.formatDateForHeader(now);
    
    // Erzeuge verfügbare Daten (7 Tage vor/nach heute)
    this.generateAvailableDates();
    
    // Erzeuge verfügbare Stunden (00-23) und Minuten (00-55 in 5er Schritten)
    this.generateAvailableHoursAndMinutes();
    
    // Indizes für das aktuelle Datum und die aktuelle Zeit finden
    this.findAndSetInitialIndices(now);
  }
  
  ngAfterViewInit() {
    // Initialisiere die Position der Räder nach dem View-Init
    setTimeout(() => {
      this.scrollToSelectedDate();
      this.scrollToSelectedHour();
      this.scrollToSelectedMinute();
    }, 100);
  }
  
  toggleDateTimePicker() {
    this.isPickerVisible = !this.isPickerVisible;
    
    if (this.isPickerVisible) {
      // Wenn Picker geöffnet wird, aktualisiere die Scroll-Position
      setTimeout(() => {
        this.scrollToSelectedDate();
        this.scrollToSelectedHour();
        this.scrollToSelectedMinute();
      }, 100);
    }
  }
  
  setDepartureMode() {
    this.isArrivalMode = false;
  }
  
  setArrivalMode() {
    this.isArrivalMode = true;
  }
  
  // Handler für Datum-Scroll
  onDateWheelScroll() {
    if (this.dateScrollTimeout) {
      clearTimeout(this.dateScrollTimeout);
    }
    
    // Stelle fest, welches Element in der Mitte ist
    this.dateScrollTimeout = setTimeout(() => {
      const scrollPosition = this.dateWheelRef.nativeElement.scrollTop;
      const centerPosition = scrollPosition + (this.dateWheelRef.nativeElement.clientHeight / 2);
      
      // Berechne den nächstgelegenen Index
      const index = Math.round((centerPosition - 72) / this.itemHeight);
      const clampedIndex = Math.max(0, Math.min(index, this.availableDates.length - 1));
      
      // Setze den ausgewählten Index und aktualisiere die Auswahl
      if (this.selectedDateIndex !== clampedIndex) {
        this.selectedDateIndex = clampedIndex;
        this.updateSelectedDate();
      }
      
      // Snap zur Mitte
      this.snapDateToCenter();
    }, 150);
  }
  
  // Handler für Stunden-Scroll
  onHourWheelScroll() {
    if (this.hourScrollTimeout) {
      clearTimeout(this.hourScrollTimeout);
    }
    
    this.hourScrollTimeout = setTimeout(() => {
      const scrollPosition = this.hourWheelRef.nativeElement.scrollTop;
      const centerPosition = scrollPosition + (this.hourWheelRef.nativeElement.clientHeight / 2);
      
      const index = Math.round((centerPosition - 72) / this.itemHeight);
      const clampedIndex = Math.max(0, Math.min(index, this.availableHours.length - 1));
      
      if (this.selectedHourIndex !== clampedIndex) {
        this.selectedHourIndex = clampedIndex;
        this.updateSelectedTime();
      }
      
      this.snapHourToCenter();
    }, 150);
  }
  
  // Handler für Minuten-Scroll
  onMinuteWheelScroll() {
    if (this.minuteScrollTimeout) {
      clearTimeout(this.minuteScrollTimeout);
    }
    
    this.minuteScrollTimeout = setTimeout(() => {
      const scrollPosition = this.minuteWheelRef.nativeElement.scrollTop;
      const centerPosition = scrollPosition + (this.minuteWheelRef.nativeElement.clientHeight / 2);
      
      const index = Math.round((centerPosition - 72) / this.itemHeight);
      const clampedIndex = Math.max(0, Math.min(index, this.availableMinutes.length - 1));
      
      if (this.selectedMinuteIndex !== clampedIndex) {
        this.selectedMinuteIndex = clampedIndex;
        this.updateSelectedTime();
      }
      
      this.snapMinuteToCenter();
    }, 150);
  }
  
  // Scrollt das Datum-Rad zur aktuellen Auswahl
  scrollToSelectedDate() {
    if (!this.dateWheelRef?.nativeElement) return;
    const targetScrollPosition = this.selectedDateIndex * this.itemHeight;
    this.dateWheelRef.nativeElement.scrollTop = targetScrollPosition;
  }
  
  // Scrollt das Stunden-Rad zur aktuellen Auswahl
  scrollToSelectedHour() {
    if (!this.hourWheelRef?.nativeElement) return;
    const targetScrollPosition = this.selectedHourIndex * this.itemHeight;
    this.hourWheelRef.nativeElement.scrollTop = targetScrollPosition;
  }
  
  // Scrollt das Minuten-Rad zur aktuellen Auswahl
  scrollToSelectedMinute() {
    if (!this.minuteWheelRef?.nativeElement) return;
    const targetScrollPosition = this.selectedMinuteIndex * this.itemHeight;
    this.minuteWheelRef.nativeElement.scrollTop = targetScrollPosition;
  }
  
  // Aktualisiert das ausgewählte Datum basierend auf dem Index
  updateSelectedDate() {
    const selectedDate = this.availableDates[this.selectedDateIndex];
    this.selectedDate = this.formatDateForInput(selectedDate);
    this.selectedDateFormatted = this.formatDateForHeader(selectedDate);
    this.emitDateTimeChange();
  }
  
  // Aktualisiert die ausgewählte Zeit basierend auf den Stunden- und Minutenindizes
  updateSelectedTime() {
    const hour = this.availableHours[this.selectedHourIndex];
    const minute = this.availableMinutes[this.selectedMinuteIndex];
    this.selectedTime = `${hour}:${minute}`;
    this.emitDateTimeChange();
  }
  
  // "Snap" Animation zum nächstgelegenen Element im Datum-Rad
  snapDateToCenter() {
    if (!this.dateWheelRef?.nativeElement) return;
    const targetScrollPosition = this.selectedDateIndex * this.itemHeight;
    this.dateWheelRef.nativeElement.scrollTo({
      top: targetScrollPosition,
      behavior: 'smooth'
    });
  }
  
  // "Snap" Animation zum nächstgelegenen Element im Stunden-Rad
  snapHourToCenter() {
    if (!this.hourWheelRef?.nativeElement) return;
    const targetScrollPosition = this.selectedHourIndex * this.itemHeight;
    this.hourWheelRef.nativeElement.scrollTo({
      top: targetScrollPosition,
      behavior: 'smooth'
    });
  }
  
  // "Snap" Animation zum nächstgelegenen Element im Minuten-Rad
  snapMinuteToCenter() {
    if (!this.minuteWheelRef?.nativeElement) return;
    const targetScrollPosition = this.selectedMinuteIndex * this.itemHeight;
    this.minuteWheelRef.nativeElement.scrollTo({
      top: targetScrollPosition,
      behavior: 'smooth'
    });
  }
  
  generateAvailableDates() {
    const today = new Date();
    this.availableDates = [];
    
    // 7 Tage vor heute bis 7 Tage nach heute
    for (let i = -7; i <= 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      this.availableDates.push(date);
    }
  }
  
  generateAvailableHoursAndMinutes() {
    // Stunden (00-23)
    this.availableHours = [];
    for (let hour = 0; hour < 24; hour++) {
      this.availableHours.push(hour.toString().padStart(2, '0'));
    }
    
    // Minuten (00, 05, 10, ..., 55)
    this.availableMinutes = [];
    for (let minute = 0; minute < 60; minute += 5) {
      this.availableMinutes.push(minute.toString().padStart(2, '0'));
    }
  }
  
  formatDateForDisplay(date: Date): string {
    // Prüfe, ob das Datum der heutige Tag ist
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return 'Heute';
    }
    
    return date.toLocaleDateString('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    });
  }

  formatDateForHeader(date: Date): string {
    return date.toLocaleDateString('de-DE', {
      weekday: 'short', 
      day: '2-digit',
      month: '2-digit'
    });
  }
  
  formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  formatTimeForInput(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = Math.floor(date.getMinutes() / 5) * 5; // Auf nächsten 5er-Schritt runden
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }
  
  // Diese Methode findet die Indizes für das aktuelle Datum und die aktuelle Zeit
  private findAndSetInitialIndices(currentDate: Date) {
    // Index des aktuellen Datums finden
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Setze Uhrzeit auf Mitternacht für Vergleich
    
    this.selectedDateIndex = this.availableDates.findIndex(date => {
      const compareDate = new Date(date);
      compareDate.setHours(0, 0, 0, 0);
      return compareDate.getTime() === today.getTime();
    });
    
    if (this.selectedDateIndex === -1) {
      this.selectedDateIndex = 7; // Standardwert (Mitte der Liste)
    }
    
    // Index der aktuellen Stunde und Minute finden
    const currentHours = currentDate.getHours();
    const hourStr = currentHours.toString().padStart(2, '0');
    this.selectedHourIndex = this.availableHours.findIndex(h => h === hourStr);
    
    const currentMinutes = currentDate.getMinutes();
    const roundedMinutes = Math.floor(currentMinutes / 5) * 5;
    const minuteStr = roundedMinutes.toString().padStart(2, '0');
    this.selectedMinuteIndex = this.availableMinutes.findIndex(m => m === minuteStr);
    
    if (this.selectedHourIndex === -1) this.selectedHourIndex = 0;
    if (this.selectedMinuteIndex === -1) this.selectedMinuteIndex = 0;
  }
  
  emitDateTimeChange() {
    const dateTime = new Date(this.selectedDate);
    const [hours, minutes] = this.selectedTime.split(':').map(Number);
    dateTime.setHours(hours, minutes);
    this.dateTimeSelected.emit(dateTime);
  }
}