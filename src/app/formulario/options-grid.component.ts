import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-options-grid',
  templateUrl: './options-grid.component.html',
  styleUrls: ['./options-grid.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class OptionsGridComponent {
  @Input() items: any[] = [];
  @Input() selectedValue: any;
  @Input() name: string = '';
  @Input() disabled: boolean = false;
  @Input() vertical: boolean = false;
  @Input() columns: number = 0;
  @Output() selectedValueChange = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any>();

  onSelect(value: any): void {
    this.selectedValue = value;
    this.selectedValueChange.emit(value);
    this.selectionChange.emit(value);
  }

  isSelected(item: any): boolean {
    return item.id === this.selectedValue;
  }
}
