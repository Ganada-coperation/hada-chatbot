import { Injectable } from '@nestjs/common';

@Injectable()
export class NewsletterService {
  private subscribers = new Set<string>();

  async subscribe(email: string): Promise<{ success: boolean }> {
    if (this.subscribers.has(email)) {
      return { success: false };
    }
    this.subscribers.add(email);
    return { success: true };
  }
}
