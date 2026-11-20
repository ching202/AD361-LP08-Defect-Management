import { afterAll, beforeEach, expect, jest, test } from '@jest/globals';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { writeFileSync } from 'node:fs';
import App from '../src/App';
import database from '../db.json';

// These checks capture reproducible starter behavior, including defects.
// Passing the capture checks does NOT mean the app meets its requirements.
const observations: Array<Record<string, unknown>> = [];
const observe = (id: string, details: Record<string, unknown>) => observations.push({ id, ...details });

beforeEach(() => {
  globalThis.fetch = jest.fn(async () => ({
    ok: true,
    json: async () => database.rentals,
  })) as unknown as typeof fetch;
});

afterAll(() => {
  if (process.env.OBSERVATIONS_FILE) {
    writeFileSync(process.env.OBSERVATIONS_FILE, JSON.stringify({
      method: 'Unchanged App.tsx and child components rendered with MemoryRouter in jsdom; only GET /rentals is replaced with the supplied db.json fixtures. Native form validation is exercised through user-event submit-button clicks.',
      observations,
    }, null, 2) + '\n');
  }
});

async function openForm() {
  const user = userEvent.setup();
  render(<MemoryRouter initialEntries={['/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><App /></MemoryRouter>);
  await screen.findByText('Cozy Cabin');
  await user.click(screen.getByRole('link', { name: 'Add Booking' }));
  return user;
}

async function fill(user: ReturnType<typeof userEvent.setup>, guests: string, chooseRental = true, date = '2026-12-10') {
  if (chooseRental) await user.selectOptions(screen.getByLabelText('Rental:'), 'Beachfront Condo');
  if (date) fireEvent.change(screen.getByLabelText('Date:'), { target: { value: date } });
  await user.clear(screen.getByLabelText('Number of Guests:'));
  if (guests) await user.type(screen.getByLabelText('Number of Guests:'), guests);
}

async function bookingRows(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('link', { name: 'Bookings', exact: true }));
  return Array.from(document.querySelectorAll('main p'), p => p.textContent);
}

test('OBS-01: captures the lower allowed guest boundary', async () => {
  const user = await openForm();
  await fill(user, '1');
  await user.click(screen.getByRole('button', { name: 'Confirm Booking' }));
  const rows = await bookingRows(user);
  observe('OBS-01', { guests: 1, rows });
  expect(rows).toEqual(['Rental: Beachfront Condo Date: 2026-12-10 Guests: 1']);
});

test('OBS-02: captures the upper allowed guest boundary', async () => {
  const user = await openForm();
  await fill(user, '12');
  await user.click(screen.getByRole('button', { name: 'Confirm Booking' }));
  const rows = await bookingRows(user);
  observe('OBS-02', { guests: 12, rows });
  expect(rows).toEqual(['Rental: Beachfront Condo Date: 2026-12-10 Guests: 12']);
});

test('OBS-03: checks that zero guests is blocked by native validation', async () => {
  const user = await openForm();
  await fill(user, '0');
  const input = screen.getByLabelText('Number of Guests:') as HTMLInputElement;
  const valid = input.checkValidity();
  const rangeUnderflow = input.validity.rangeUnderflow;
  await user.click(screen.getByRole('button', { name: 'Confirm Booking' }));
  const rows = await bookingRows(user);
  observe('OBS-03', { guests: 0, valid, rangeUnderflow, rows });
  expect(valid).toBe(false);
  expect(rows).toHaveLength(0);
});

test('OBS-04: checks that a missing date is blocked by native validation', async () => {
  const user = await openForm();
  await fill(user, '1', true, '');
  const input = screen.getByLabelText('Date:') as HTMLInputElement;
  const valid = input.checkValidity();
  const valueMissing = input.validity.valueMissing;
  await user.click(screen.getByRole('button', { name: 'Confirm Booking' }));
  const rows = await bookingRows(user);
  observe('OBS-04', { date: '', valid, valueMissing, rows });
  expect(valid).toBe(false);
  expect(rows).toHaveLength(0);
});

test('OBS-05: reproduces acceptance of thirteen guests', async () => {
  const user = await openForm();
  await fill(user, '13');
  const input = screen.getByLabelText('Number of Guests:') as HTMLInputElement;
  const valid = input.checkValidity();
  const maximum = input.getAttribute('max');
  await user.click(screen.getByRole('button', { name: 'Confirm Booking' }));
  const formText = document.querySelector('main')?.textContent;
  const rows = await bookingRows(user);
  observe('OBS-05', { guests: 13, valid, maximum, formTextAfterSubmit: formText, rows });
  expect(rows).toEqual(['Rental: Beachfront Condo Date: 2026-12-10 Guests: 13']);
});

test('OBS-06: reproduces acceptance of a blank guest value', async () => {
  const user = await openForm();
  await fill(user, '');
  const input = screen.getByLabelText('Number of Guests:') as HTMLInputElement;
  const valid = input.checkValidity();
  const required = input.required;
  await user.click(screen.getByRole('button', { name: 'Confirm Booking' }));
  const rows = await bookingRows(user);
  observe('OBS-06', { guests: '', valid, required, rows });
  expect(rows).toEqual(['Rental: Beachfront Condo Date: 2026-12-10 Guests: ']);
});

test('OBS-07: reproduces a blank stored rental when selection is untouched', async () => {
  const user = await openForm();
  const select = screen.getByLabelText('Rental:') as HTMLSelectElement;
  const displayedRental = select.selectedOptions[0]?.textContent;
  await fill(user, '1', false);
  await user.click(screen.getByRole('button', { name: 'Confirm Booking' }));
  const rows = await bookingRows(user);
  observe('OBS-07', { displayedRental, selectionChanged: false, rows });
  expect(rows).toEqual(['Rental:  Date: 2026-12-10 Guests: 1']);
});

test('OBS-08: records the missing checkout and stay-length controls', async () => {
  await openForm();
  const controls = Array.from(document.querySelectorAll('main input, main select'), input => ({
    name: input.getAttribute('name'), type: input.getAttribute('type'),
  }));
  observe('OBS-08', { controls, checkoutControlPresent: controls.some(c => /checkout|check.out/i.test(c.name ?? '')), nightsControlPresent: controls.some(c => /nights/i.test(c.name ?? '')) });
  expect(controls.map(c => c.name)).toEqual(['rental', 'date', 'guests']);
});

test('OBS-09: records identical rental/date bookings accepted twice', async () => {
  const user = await openForm();
  await fill(user, '1');
  await user.click(screen.getByRole('button', { name: 'Confirm Booking' }));
  await user.click(screen.getByRole('button', { name: 'Confirm Booking' }));
  const rows = await bookingRows(user);
  observe('OBS-09', { rows, limitation: 'This demonstrates no duplicate guard; absent checkout and availability fixtures prevent a full occupied-night acceptance test.' });
  expect(rows).toHaveLength(2);
  expect(rows[0]).toBe(rows[1]);
});

test('OBS-10: records the absence of a cleaning fee or total in the saved view', async () => {
  const user = await openForm();
  await fill(user, '1');
  await user.click(screen.getByRole('button', { name: 'Confirm Booking' }));
  const rows = await bookingRows(user);
  const bookingView = document.querySelector('main')?.textContent;
  observe('OBS-10', { rows, bookingView, limitation: 'No payment is performed. Missing pricing is reported, not an observed incorrect charge.' });
  expect(bookingView).not.toMatch(/cleaning|fee|total|\$/i);
});

test('OBS-11: reproduces the empty rental list on a fresh direct booking route', async () => {
  render(<MemoryRouter initialEntries={['/bookings/add']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><App /></MemoryRouter>);
  const select = screen.getByLabelText('Rental:') as HTMLSelectElement;
  const options = Array.from(select.options, option => option.textContent);
  observe('OBS-11', { initialRoute: '/bookings/add', options, rentalFetchCalls: (globalThis.fetch as ReturnType<typeof jest.fn>).mock.calls.length });
  expect(options).toHaveLength(0);
  expect(globalThis.fetch).not.toHaveBeenCalled();
});

test('OBS-12: records unchanged content after the More and Save buttons', async () => {
  const user = userEvent.setup();
  render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><App /></MemoryRouter>);
  await screen.findByText('Cozy Cabin');
  const beforeText = document.querySelector('main')?.textContent;
  await user.click(screen.getAllByRole('button', { name: 'More', exact: true })[0]);
  const afterMore = document.querySelector('main')?.textContent;
  await user.click(screen.getAllByRole('button', { name: 'Save', exact: true })[0]);
  const afterSave = document.querySelector('main')?.textContent;
  observe('OBS-12', { moreChangedContent: beforeText !== afterMore, saveChangedContent: beforeText !== afterSave, sourceCheck: 'RentalCard.tsx contains no handlers for More, Save, FavoriteBorderIcon, or ShareIcon.' });
  expect(afterMore).toBe(beforeText);
  expect(afterSave).toBe(beforeText);
});

test('OBS-13: records that bookings disappear after the app is remounted', async () => {
  const user = await openForm();
  await fill(user, '1');
  await user.click(screen.getByRole('button', { name: 'Confirm Booking' }));
  const before = await bookingRows(user);
  cleanup();
  render(<MemoryRouter initialEntries={['/bookings']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><App /></MemoryRouter>);
  const after = Array.from(document.querySelectorAll('main p'), p => p.textContent);
  observe('OBS-13', { before, after, classification: 'Requires investigation: persistence after a reload is not specified in the six supplied requirements.' });
  expect(before).toHaveLength(1);
  expect(after).toHaveLength(0);
});
