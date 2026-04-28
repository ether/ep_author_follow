import {expect, test} from '@playwright/test';
import {goToNewPad} from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
});

test.describe('ep_author_follow', () => {
  test('toggling the checkbox flips clientVars.ep_author_follow.enableFollow', async ({page}) => {
    const cb = page.locator('#options-enableFollow');
    await expect(cb).toBeChecked();
    expect(await page.evaluate(() => (window as any).clientVars.ep_author_follow.enableFollow))
        .toBe(true);

    await cb.click();
    await expect(cb).not.toBeChecked();
    await expect.poll(async () => page.evaluate(
        () => (window as any).clientVars.ep_author_follow.enableFollow)).toBe(false);

    await cb.click();
    await expect(cb).toBeChecked();
    await expect.poll(async () => page.evaluate(
        () => (window as any).clientVars.ep_author_follow.enableFollow)).toBe(true);
  });
});
