# Playwright Test Automation Challenge - SauceDemo

This repository contains the solution for the Senior QA Automation Engineer practical assignment. It features a robust test automation framework built from scratch using Playwright and TypeScript to test the `saucedemo.com` website.

## Setup and Installation

1.  **Prerequisites:** [Node.js](https://nodejs.org/) (version 18+) must be installed.
2.  **Clone & Install:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/playwright-saucedemo-challenge.git
    cd playwright-saucedemo-challenge
    npm install
    npx playwright install
    ```
3.  **Environment File:** For local execution, create a `.env` file in the root directory with the necessary credentials:
    ```
    STANDARD_USER=standard_user
    PROBLEM_USER=problem_user
    PASSWORD=secret_sauce
    ```

## Running the Tests

-   Run all tests headlessly: `npx playwright test`
-   View the HTML report: `npx playwright show-report`

## Test Case Results Analysis

The test suite is designed to produce a fully passing ("green") build.

-   `TC-001` & `TC-002`: **PASS** - These tests successfully validate application features for a standard user.
-   `TC-003`: **PASS (Marked as Expected Failure)** - This test covers a known bug with the `problem_user`. By using Playwright's `test.fail()` annotation, we acknowledge the bug and prevent it from failing the CI/CD pipeline, while keeping the test in place to monitor the bug's status.

## CI/CD with GitHub Actions

The project is configured with a GitHub Actions workflow that runs all tests on every push to the `main` branch and uploads the test report as a build artifact.