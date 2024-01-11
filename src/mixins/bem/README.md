# BEM Helper - Vue Mixin

This is a custom mixin that I've adapted from the `@vuebits/bem` npm package for adding a BEM helper within a Vue
project. I will eventually be turning this into a new NPM package since `@vuebits/bem` appears to be unmaintained.

### Changes that I've made from the npm package:

- The implementation of the `useBem` composable for use in Vue setup scripts.
- Breaking up the `getClassName` helper method into more concise helper methods. This was done to:
    - Improve readability
    - Introduce some self-documentation
    - Micro optimize performance by caching the evaluated block/element classes instead of re-computing them from
      scratch for each element/modifier subclass.
- Refactored the `hyphenate` config property to default to `true`.
- Removed the unit-tests since they were crashing/not working with a fresh repo clone.
    - This appears to be due to the unit-tests not being maintained as the repository evolved.
    - These will be re-implemented at a later date when I have the time to take a closer look at it.

### Planned changes:

- Possibly implementing the BEM mixin as a Vue Directive, so it can then be used in combination with Atomic CSS
  packages like `Tailwind`.
    - The intended use-case would then be to generate selectors for automated regression testing frameworks like
      Selenium, increasing QA reliability.
