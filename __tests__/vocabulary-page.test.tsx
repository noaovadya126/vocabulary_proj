import '@testing-library/jest-dom';

// Simple test to verify the test setup is working
describe('Vocabulary Page System', () => {
  test('basic test setup is working', () => {
    expect(true).toBe(true);
  });

  test('can perform basic math', () => {
    expect(3 + 3).toBe(6);
  });

  test('can handle strings', () => {
    const message = 'Vocabulary Learning';
    expect(message).toContain('Learning');
  });
});
