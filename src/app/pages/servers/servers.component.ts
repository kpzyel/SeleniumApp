import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.sass']
})
export class ServersComponent implements OnInit {

  serverList = [];

  constructor() { }

  ngOnInit() {
    console.log('ServersComponent');
    this.serverList.push({
      title: 'server_01',
      status: 'Ok'
    });

    this.serverList.push({
      title: 'server_02',
      status: 'Bad'
    });
  }
}

// hijack console log, to get access to it
// (function() {
//   const oldLog = console.log;
//   const oldError = console.error;

//   console.log = function (message) {
//       oldLog.apply(console, arguments);
//       // alert('log message ' + message);
//   };

//   console.error = function (messageTitle, messageBody) {
//     oldError.apply(console, arguments);
    // setWE(messageTitle, messageBody);
    // alert('error message ' +  (<any>window).error.title +  (<any>window).error.value);
    // console.log('message', window.error);
  // };

  // function setWE(messageTitle, messageBody) {
  //   (<any>window).error = {
  //     title: messageTitle,
  //     value: messageBody
  //   };

  //   (<any>window).getError = function() {
  //     return (<any>window).error;
  //   };
  // }

  // function getWE() {
  //   return (<any>window).getError();
  // }
// })();
