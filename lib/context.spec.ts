import { Context } from './context';

describe('Context', () => {
  let req: any;
  let context: Context;

  beforeEach(() => {
    req = {
      nextUrl: {
        searchParams: new URLSearchParams(),
      },
    };
    context = new Context(req);
  });

  it('should set and get data correctly', () => {
    context.set('key', 'value');
    const retrievedValue = context.get('key');

    expect(retrievedValue).toBe('value');
  });

  it('should return default value if data does not exist', () => {
    const retrievedValue = context.get('nonexistentKey', 'default');

    expect(retrievedValue).toBe('default');
  });

  it('should return URLSearchParams object from nextUrl', () => {
    const searchParams = context.searchParams();

    expect(searchParams instanceof URLSearchParams).toBe(true);
  });

  it('should set and get request body correctly', () => {
    const body = { id: 1, name: 'John Doe' };
    context.setBody(body);
    const retrievedBody = context.getBody();

    expect(retrievedBody).toEqual(body);
  });

  it('should set and get user information correctly', () => {
    const user = { id: 1, name: 'John Doe' };
    context.setUser(user);
    const retrievedUser = context.getUser();

    expect(retrievedUser).toEqual(user);
  });
});
