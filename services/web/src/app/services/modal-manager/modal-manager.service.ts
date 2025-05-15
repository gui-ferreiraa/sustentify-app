import { Injectable, signal, Signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalManagerService {

  private modals = new Map<string, WritableSignal<boolean>>();

  constructor() { }

  private ensureModal(id: string) {
    if (!this.modals.has(id)) {
      this.modals.set(id, signal(false));
    }
  }

  open(id: string) {
    this.ensureModal(id);
    this.modals.get(id)!.set(true);
  }

  close(id: string) {
    this.ensureModal(id);
    this.modals.get(id)!.set(false);
  }

  toggle(id: string) {
    this.ensureModal(id);
    const modal = this.modals.get(id)!;
    modal.set(!modal());
  }

  isOpen(id: string): WritableSignal<boolean> {
    this.ensureModal(id);
    return this.modals.get(id)!;
  }
}
