import { test, expect } from '@playwright/test';
import { createBed } from './helpers/beds';

test.describe('Add Bed Status', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should show add button on bed hover', async ({ page }) => {
    // Create a test bed
    const bed = await createBed('Test Bed A');
    
    await page.reload();
    
    // Find the bed name element
    const bedName = page.locator('.bed-name', { hasText: 'Test Bed A' });
    
    // Add button should be hidden initially
    const addButton = bedName.locator('.bed-add-button');
    await expect(addButton).toHaveCSS('opacity', '0');
    
    // Hover over bed name
    await bedName.hover();
    
    // Add button should be visible on hover
    await expect(addButton).toHaveCSS('opacity', '1');
  });

  test('should open modal when add button is clicked', async ({ page }) => {
    // Create a test bed
    const bed = await createBed('Test Bed B');
    
    await page.reload();
    
    // Click the add button
    const bedName = page.locator('.bed-name', { hasText: 'Test Bed B' });
    await bedName.hover();
    await bedName.locator('.bed-add-button').click();
    
    // Modal should be visible
    await expect(page.locator('text=Add Bed Status')).toBeVisible();
    
    // Form elements should be present
    await expect(page.locator('select[name="bedId"]')).toBeVisible();
    await expect(page.locator('input[name="time"]')).toBeVisible();
    await expect(page.locator('select[name="duration"]')).toBeVisible();
    await expect(page.locator('input[name="status"]')).toBeVisible();
    
    // Bed should be pre-selected
    await expect(page.locator('select[name="bedId"]')).toHaveValue(bed.id.toString());
  });

  test('should close modal when cancel is clicked', async ({ page }) => {
    // Create a test bed
    const bed = await createBed('Test Bed C');
    
    await page.reload();
    
    // Open modal
    const bedName = page.locator('.bed-name', { hasText: 'Test Bed C' });
    await bedName.hover();
    await bedName.locator('.bed-add-button').click();
    
    // Click cancel
    await page.click('button:has-text("Cancel")');
    
    // Modal should be hidden
    await expect(page.locator('text=Add Bed Status')).not.toBeVisible();
  });

  test('should create bed status when form is submitted', async ({ page }) => {
    // Create a test bed
    const bed = await createBed('Test Bed D');
    
    await page.reload();
    
    // Open modal
    const bedName = page.locator('.bed-name', { hasText: 'Test Bed D' });
    await bedName.hover();
    await bedName.locator('.bed-add-button').click();
    
    // Fill form
    await page.selectOption('select[name="bedId"]', bed.id.toString());
    await page.fill('input[name="time"]', '14:30');
    await page.selectOption('select[name="duration"]', '60');
    await page.fill('input[name="status"]', 'Occupied');
    
    // Submit form
    await page.click('button:has-text("Save")');
    
    // Modal should close
    await expect(page.locator('text=Add Bed Status')).not.toBeVisible();
    
    // Page should reload and show the new status
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.bed-status', { hasText: 'Occupied' })).toBeVisible();
  });

  test('should require all fields', async ({ page }) => {
    // Create a test bed
    const bed = await createBed('Test Bed E');
    
    await page.reload();
    
    // Open modal
    const bedName = page.locator('.bed-name', { hasText: 'Test Bed E' });
    await bedName.hover();
    await bedName.locator('.bed-add-button').click();
    
    // Clear status field and try to submit
    await page.fill('input[name="status"]', '');
    await page.click('button:has-text("Save")');
    
    // Form should not submit (HTML5 validation)
    await expect(page.locator('text=Add Bed Status')).toBeVisible();
    await expect(page.locator('input[name="status"]:invalid')).toBeVisible();
  });
}); 