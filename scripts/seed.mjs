// Fill an empty Firestore with demo contacts and tasks.
// Run once with: npm run seed
//
// Uses the client SDK with anonymous sign-in on purpose: no service account key
// is needed, so nothing secret has to live in this public repository.

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

// Keep in sync with src/app/app.config.ts
const FIREBASE_CONFIG = {
  projectId: 'join-593b3',
  appId: '1:390589623561:web:4df3c1d39b3387740e77d8',
  storageBucket: 'join-593b3.firebasestorage.app',
  apiKey: 'AIzaSyCdR4LqlOvdOP5vWlXxD-1IEMOihWovqfo',
  authDomain: 'join-593b3.firebaseapp.com',
  messagingSenderId: '390589623561',
};

// Colors mirror --userColor1..15 from src/app/styles/colors.scss
const CONTACTS = [
  { name: 'Anja Schulz', email: 'anja.schulz@example.com', phone: '+49 170 1111111', color: '#FF7A00' },
  { name: 'Benedikt Ziegler', email: 'b.ziegler@example.com', phone: '+49 170 2222222', color: '#FF5EB3' },
  { name: 'David Eisenberg', email: 'd.eisenberg@example.com', phone: '+49 170 3333333', color: '#6E52FF' },
  { name: 'Eva Fischer', email: 'eva.fischer@example.com', phone: '+49 170 4444444', color: '#9327FF' },
  { name: 'Marcel Bauer', email: 'm.bauer@example.com', phone: '+49 170 5555555', color: '#00BEE8' },
  { name: 'Tatjana Wolf', email: 't.wolf@example.com', phone: '+49 170 6666666', color: '#1FD7C1' },
];

// type: 1 = UserStory, 2 = TechnicalTask | priority: 1 = urgent, 2 = medium, 3 = low
// status must cover all four board columns: todo, in_progress, await_feedback, done
const TASKS = [
  {
    title: 'Kochwelt Page & Recipe Recommender',
    description: 'Build start page with recipe recommendation.',
    type: 1,
    status: 'todo',
    priority: 2,
    dueDate: '2026-09-15',
    subtasks: ['Implement Recipe Recommendation', 'Start Page Layout'],
    assignees: ['Anja Schulz', 'David Eisenberg'],
  },
  {
    title: 'CSS Architecture Planning',
    description: 'Define CSS naming conventions and directory structure.',
    type: 2,
    status: 'todo',
    priority: 1,
    dueDate: '2026-08-30',
    subtasks: ['Establish CSS Methodology', 'Setup Base Styles'],
    assignees: ['Benedikt Ziegler'],
  },
  {
    title: 'HTML Base Template Creation',
    description: 'Create reusable HTML base templates for all pages.',
    type: 2,
    status: 'in_progress',
    priority: 3,
    dueDate: '2026-09-05',
    subtasks: ['Header Component', 'Footer Component'],
    assignees: ['Eva Fischer', 'Marcel Bauer'],
  },
  {
    title: 'Daily Kochwelt Recipe',
    description: 'Implement daily recipe view and portion calculator.',
    type: 1,
    status: 'await_feedback',
    priority: 2,
    dueDate: '2026-09-20',
    subtasks: ['Portion Calculator'],
    assignees: ['Tatjana Wolf'],
  },
  {
    title: 'Contact Form & Imprint',
    description: 'Create contact form and imprint page.',
    type: 1,
    status: 'await_feedback',
    priority: 3,
    dueDate: '2026-10-01',
    subtasks: ['Form Validation', 'Imprint Content'],
    assignees: ['Anja Schulz'],
  },
  {
    title: 'Firebase Setup & Migration',
    description: 'Connect the application to an own Firebase project.',
    type: 2,
    status: 'done',
    priority: 1,
    dueDate: '2026-07-22',
    subtasks: ['Configure Auth Providers', 'Write Security Rules'],
    assignees: ['Marcel Bauer', 'Benedikt Ziegler'],
  },
];

/** Return the uppercase initials of a full name. */
function initialsOf(name) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

/** Create all demo contacts and return a name -> contact map. */
async function seedContacts(db) {
  const byName = new Map();
  for (const contact of CONTACTS) {
    // isUser stays false: true is reserved for real registered accounts
    const ref = await addDoc(collection(db, 'contacts'), { ...contact, isUser: false });
    byName.set(contact.name, { id: ref.id, ...contact });
    console.log(`contact  ${contact.name}`);
  }
  return byName;
}

/** Write the subtask documents of one task. */
async function seedSubtasks(db, taskId, titles) {
  for (const title of titles) {
    await addDoc(collection(db, `tasks/${taskId}/subtasks`), { title, done: false });
  }
}

/** Write the assign documents of one task, denormalised the way the app does it. */
async function seedAssigns(db, taskId, names, contactsByName) {
  for (const name of names) {
    const contact = contactsByName.get(name);
    if (!contact) throw new Error(`seedAssigns: unknown contact "${name}"`);
    await addDoc(collection(db, `tasks/${taskId}/assigns`), {
      contactId: contact.id,
      name: contact.name,
      initials: initialsOf(contact.name),
      color: contact.color,
    });
  }
}

/** Create one task document together with its subtasks and assigns. */
async function seedTask(db, task, contactsByName) {
  const { subtasks, assignees, dueDate, ...fields } = task;
  // date must be a real Timestamp, a plain string breaks the board rendering
  const ref = await addDoc(collection(db, 'tasks'), {
    ...fields,
    date: Timestamp.fromDate(new Date(dueDate)),
  });
  await seedSubtasks(db, ref.id, subtasks);
  await seedAssigns(db, ref.id, assignees, contactsByName);
  console.log(`task     ${task.title}`);
}

/** Seed the whole database once. */
async function main() {
  const app = initializeApp(FIREBASE_CONFIG);
  const db = getFirestore(app);
  await signInAnonymously(getAuth(app)); // security rules require an authenticated caller
  const contactsByName = await seedContacts(db);
  for (const task of TASKS) await seedTask(db, task, contactsByName);
  console.log(`\nDone: ${CONTACTS.length} contacts, ${TASKS.length} tasks.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
