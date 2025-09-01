import '@testing-library/jest-dom';

// Simple test to verify the test setup is working
describe('Vocabulary Learning System', () => {
  test('basic test setup is working', () => {
    expect(true).toBe(true);
  });

  test('can perform basic math', () => {
    expect(2 + 2).toBe(4);
  });

  test('can handle strings', () => {
    const greeting = 'Hello World';
    expect(greeting).toContain('Hello');
  });
});
