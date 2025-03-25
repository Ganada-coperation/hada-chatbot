import { Injectable } from '@nestjs/common';

@Injectable()
export class UserSessionService {
    private sessions: { [userId: string]: string[] } = {};

    getHistory(userId: string): string[] {
        return this.sessions[userId] ?? [];
    }

    append(userId: string, message: string) {
        if (!this.sessions[userId]) this.sessions[userId] = [];
        this.sessions[userId].push(message);
    }

    clear(userId: string) {
        delete this.sessions[userId];
    }

    ensure(userId: string) {
        if (!this.sessions[userId]) this.sessions[userId] = [];
    }
}
