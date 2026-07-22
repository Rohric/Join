# Join

Kanban task manager built with Angular 20 and Firebase (Firestore + Authentication).

> Forked from [FelixRabenholdDev/Join](https://github.com/FelixRabenholdDev/Join).
> The UI and application logic are the original author's work.
>
> **My contribution to this fork:** migration to a standalone Firebase backend —
> own Firestore database and Auth setup, Firestore security rules
> ([`firestore.rules`](firestore.rules)), a reproducible seed script
> ([`scripts/seed.mjs`](scripts/seed.mjs)) and the Firebase Hosting deployment.

## Firebase setup

The Firebase credentials live in [`src/app/app.config.ts`](src/app/app.config.ts).
Web API keys are public by design — access is controlled by the security rules,
not by keeping the keys secret.

Required configuration in the Firebase console:

- **Authentication** → enable both `Email/Password` and `Anonymous`
  (the latter powers the guest login and the seed script)
- **Firestore** → create the database, then publish `firestore.rules`
- **Firestore** → create the document `appSettings/contacts` with the field
  `lastUserColor` (type `number`, value `0`). The app updates this document on
  signup and cannot create it itself.

Fill an empty database with demo data:

```bash
npm run seed
```

## Deployment

```bash
firebase deploy --only firestore:rules
npm run build
firebase deploy --only hosting
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
