import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing session before each test
    await page.goto('/api/auth/signout');
  });

  test('should show login page when accessing protected route', async ({ page }) => {
    await page.goto('/');
    // Should redirect to login page
    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in invalid credentials
    await page.getByLabel('Username').fill('wronguser');
    await page.getByLabel('Password').fill('wrongpass');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Should show error message
    await expect(page.getByText('Invalid credentials')).toBeVisible();
    // Should stay on login page
    await expect(page).toHaveURL('/login');
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in valid credentials
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Should redirect to home page
    await expect(page).toHaveURL('/');
  });

  test('should maintain session after successful login', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Should be on home page
    await expect(page).toHaveURL('/');

    // Try accessing another protected route
    await page.goto('/some-protected-route');
    // Should not redirect to login
    await expect(page).not.toHaveURL('/login');
  });

  test('should be able to access login page when not authenticated', async ({ page }) => {
    await page.goto('/login');
    // Should stay on login page
    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
  });
}); 