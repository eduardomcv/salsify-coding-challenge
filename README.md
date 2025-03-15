# Salsify coding challenge

## Introduction

This is a UI development coding exercise for [Salsify](https://www.salsify.com/). It consists in a table of products, which can be filtered by the user.
The user can use a combination of product properties and operators to filter the results. The product data store was
provided by Salsify and is located in `public/datastore.js`.

There were no requirements on tech stack/frameworks, so I opted for using [React](https://react.dev/) + [Typescript](https://www.typescriptlang.org/),
which is the stack I'm most comfortable using. The project was bootstrapped using [Vite](https://vite.dev/) and uses
[Vitest Browser](https://vitest.dev/guide/browser/) + [Playwright](https://playwright.dev/) for testing.

You can find the original exercise repository here: https://github.com/salsify/condition-editor-coding-exercise

## Installation

1. Clone this repository.
2. `cd` into the root directory of the project.
3. Run `npm install`.

Note: you may need to install additional dependencies for browser testing. If that is the case, Vitest should prompt to
install them when running for the first time, if they are not already installed.

## Available scripts

- `npm run dev` - Run the dev server.
- `npm run build` - Build the application production bundle.
- `npm run lint` - Run linting tasks (ESlint) on the codebase (checks only).
- `npm run format` - Format the codebase using Prettier.
- `npm run test` - Run tests (Vitest).

## Guide

The project's codebase is located entirely in the `src/` directory, with the exception of `datastore.js`, which is
located in `public/datastore.js`. I decided to place the data store there to keep it exactly "as is", and to load
it directly in the html, before rendering the application (i.e. there is a `script` tag in the `index.html` file
which loads `datastore.js`). The main entry point for the application is the `src/main.tsx`, which renders the
`App` component into the document.

Because this is a Typescript project, I have written types for the data store's structure. You can find those
types in `src/datastoreTypes.ts`. I've also extended the `Window` interface to include `window.datastore` in
`src/globals.d.ts`.

The application is split into three components: `App`, `ProductsFilter` and `ProductsTable`, which are located in the
`src/components/` directory.
`App` is the main component, which holds application state and renders the application container.
`ProductsFilter` handles rendering the selectors and inputs for filtering products. It's a visual representation of the
filter's current state.
`ProductsTable` applies the chosen filters to the products list and renders this filtered list as a table.

Tests are located in the `src/tests/` directory.

## Notes

The project took me about 12 hours in the span of four days. I took some time initially to look at the data structure
and try to understand how it could work.
After bootstrapping the project, I started by writing a simple table to list the products, to try to see in practise
how the data was organized. Doing this made me realise that each product had properties, but each property had a
corresponding ID, so the order in which these properties appeared in the products didn't matter, and not all properties
would necessarily be shown in the table.

Then, I started working on the filter inputs, filter state, and all the render logic involved. I also noticed that each
property had a type, and each property type had it's own set of valid operators, so I created a map for this.

After finishing the filters and filter state, I worked on the table and the filter function. My goal was to create a
function that took the selected filters as an input and would return a filtered product list as an output.

I wrapped up development by writing tests for the features required.

I had to make an assumption regarding the "Equals" operator for enumerable properties, where all selected values must
match the property values exactly, otherwise it would function the same as the "Is any of" operator.
For the "Is any of" operator, I've assumed that the separator for string/number properties would be ", " (comma followed
by space). For assumptions like these, and other thoughts, I've added comments throughout the codebase when I felt they
were needed.

Regarding tests, I've focused mainly on integration tests because, for the scope of this exercise, I thought there
would be more value (per time spent writing) in testing the features as a whole, rather than testing individual units.
I've chosen Vitest Browser because it can leverage Playwright to run the tests in an actual browser, rather than
simulating a browser environment with tools like `jsdom`.
Additionally, I wrote at least one test for every feature described by the requirements, but I haven't been thorough in
testing every possible combination of selections/inputs. I'm assuming the current tests are enough to get an idea of
my intentions.

I haven't used any CSS framework or convention. I've only used vanilla CSS and wrote some very basic,
workable styles. My assumption was that the exercise wasn't so much about creating something "pretty", but more about
creating something functional.
