import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class EmailAttemptService {
  private readonly cooldownMinutes = 3;
  private readonly lastAttemptKey = 'lastEmailAttempt';

  constructor(
    private readonly toastr: ToastrService
  ) { }

  public hasRecentAttempt(): boolean {
    const now = Date.now();
    const lastAttemptStr = localStorage.getItem(this.lastAttemptKey);

    if (lastAttemptStr) {
      const lastAttemptTime = parseInt(lastAttemptStr, 10);
      const diffInMinutes = (now - lastAttemptTime) / 1000 / 60;

      if (diffInMinutes < this.cooldownMinutes) {
        this.toastr.warning(
          `Aguarde ${Math.ceil(this.cooldownMinutes - diffInMinutes)} minuto(s) para tentar novamente.`
        );
        return true;
      }
    }

    localStorage.setItem(this.lastAttemptKey, now.toString());
    return false;
  }
}
