# How to become a contributor and submit your own code

**Table of contents**

* [Contributing a patch](#contributing-a-patch)
* [Running the tests](#running-the-tests)

## Contributing A Patch

1. Submit an issue describing your proposed change to the repo in question.
2. The repo owner will respond to your issue promptly.
3. If your proposed change is accepted, and you haven't already done so, sign a
   Contributor License Agreement (see details above).
4. Fork the desired repo, develop and test your code changes.
5. Ensure that your code adheres to the existing style in the code to which
   you are contributing.
6. Ensure that your code has an appropriate set of tests which all pass.
7. Title your pull request following [Conventional Commits](https://www.conventionalcommits.org/) styling.
8. Submit a pull request.

## Running the tests

1. [Prepare your environment for Node.js setup][setup].

2. Install dependencies:

        npm install

3. Run the tests:

        # Run unit tests.
        npm test

        # Run lint check.
        npm run lint

4. Lint (and maybe fix) any changes:

        npm run format

[setup]: https://cloud.google.com/nodejs/docs/setup
