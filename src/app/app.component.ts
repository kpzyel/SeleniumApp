import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'seleniumApp';
}

(function () {
  if (( < any > window).logEvents) {
    return;
  }
  const oldError = console.error;

  function captureUnhandled(msg, url, lineNumber, col, obj) {
    const logErrors = new Date() + ' unhandled - ' + msg + ', ' + obj.stack;
    ( < any > window).logEvents.push(logErrors);
    oldError.apply(console, arguments);
  }

  function capture() {
    return function () {
      const args = Array.prototype.slice.call(arguments, 0);

      let errorString = new Date() + ' error - ';
      for (let i = 0; i < args.length; i++) {
        if (args[i] instanceof Error) {
          errorString += args[i].message + '\n ' + args[i].stack;
        } else {
          errorString += args[i];
        }
      }
      ( < any > window).logEvents.push(errorString);

      oldError.apply(console, arguments);
    };
  }

  ( < any > console) = console || {};
  console.error = capture();
  window.onerror = captureUnhandled;
  ( < any > window).logEvents = [];
}());
