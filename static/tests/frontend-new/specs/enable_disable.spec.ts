import {expect, test} from '@playwright/test';
import {goToNewPad} from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
});

// The settings popup is closed by default and the legacy test poked the
// checkbox through jQuery without opening anything. Match that behaviour
// by driving the checkbox via DOM instead of Playwright actionability.
const toggle = (page: any) => page.evaluate(() => {
  const cb = document.querySelector<HTMLInputElement>('#options-enableFollow')!;
  cb.click();
});

test.describe('ep_author_follow', () => {
  test('toggling the checkbox flips clientVars.ep_author_follow.enableFollow', async ({page}) => {
    const isChecked = () => page.evaluate(
        () => document.querySelector<HTMLInputElement>('#options-enableFollow')!.checked);
    const enableFollow = () => page.evaluate(
        () => (window as any).clientVars.ep_author_follow.enableFollow);

    expect(await isChecked()).toBe(true);
    expect(await enableFollow()).toBe(true);

    await toggle(page);
    expect(await isChecked()).toBe(false);
    await expect.poll(enableFollow).toBe(false);

    await toggle(page);
    expect(await isChecked()).toBe(true);
    await expect.poll(enableFollow).toBe(true);
  });
});
