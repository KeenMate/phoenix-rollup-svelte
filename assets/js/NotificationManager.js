import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

import CBuffer from 'CBuffer';
import { Subject } from "rxjs";

const BufferSize = 3;

export default class NotificationManager {
  constructor() {
    this.notyf = new Notyf();
    this.messagesSubject = new Subject();
    this.messages = new CBuffer(BufferSize);
  }

  saveMessage(message) {
    this.messages.push(message);
    this.messagesSubject.next(this.getMessages());
  }

  success(message) {
    this.saveMessage(message);
    this.notyf.success(message);
  }

  error(message) {
    this.saveMessage(message);
    this.notyf.error(message);
  }

  getMessages() {
    return this.messages.slice(0, BufferSize);
  }
}

window.NotificationManager = new NotificationManager();