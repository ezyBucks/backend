import { isDev } from './helper';

describe('Test isDev', () => {
    it('should return true', () => {
        expect(isDev()).toBe(true);
    });
    it('should return false when env var is set', () => {
        process.env.NODE_ENV = 'production';
        expect(isDev()).toBe(false);
    });
});
