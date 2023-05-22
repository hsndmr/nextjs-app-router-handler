import { NextRequest } from 'next/server';

export class Context {
  private data: Map<string, unknown>;

  constructor(public req: NextRequest) {
    this.data = new Map<string, unknown>();
  }

  set(key: string, value: unknown) {
    this.data.set(key, value);
  }

  get<T>(key: string, defaultValue = undefined): T | typeof defaultValue {
    const value = this.data.get(key) as T;
    if (value === undefined) {
      return defaultValue;
    }

    return value;
  }

  searchParams(): URLSearchParams {
    return this.req.nextUrl.searchParams;
  }

  setBody(body: unknown) {
    this.set('body', body);
  }

  getBody<T>(): T | undefined {
    return this.get('body');
  }

  setUser(user: unknown) {
    this.set('user', user);
  }

  getUser<T>(): T | undefined {
    return this.get('user');
  }
}
