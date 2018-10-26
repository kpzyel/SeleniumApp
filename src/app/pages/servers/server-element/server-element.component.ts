import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-server-element',
  templateUrl: './server-element.component.html',
  styleUrls: ['./server-element.component.sass']
})
export class ServerElementComponent implements OnInit {

  @Input() server: any;

  constructor() { }

  ngOnInit() {
    // Example error
    variable = 'text';
  }
}
