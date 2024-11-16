import fs from "fs";
import path from "path";

class CustomReporter {
  name = "custom-detailed-reporter";

  onTestSuiteFinish(suite, results) {
    return {
      file: suite.name,
      component: suite.name.split("/").pop().replace(".test.jsx", ""),
      tests: results.tests.map((test) => ({
        name: test.name,
        suite: test.suite?.name,
        status: test.state,
        duration: test.duration,
        error: test.error ? test.error.message : null,
      })),
    };
  }

  onFinish(files, errors, results) {
    const testResults = {
      summary: {
        timestamp: new Date().toISOString(),
        totalFiles: files.length,
        totalTests: results.getTestResults().length,
        passed: results.passed,
        failed: results.failed,
        skipped: results.skipped,
        duration: results.duration,
      },
      testSuites: files.map((file) => ({
        file: file,
        results: results
          .getTestResults()
          .filter((test) => test.file === file)
          .map((test) => ({
            name: test.name,
            suite: test.suite?.name,
            status: test.state,
            duration: test.duration,
            error: test.error ? test.error.message : null,
          })),
      })),
    };

    // Ensure directory exists
    const resultsDir = path.join(process.cwd(), "tests", "results");
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }

    // Write to file
    fs.writeFileSync(
      path.join(resultsDir, "detailed-test-results.json"),
      JSON.stringify(testResults, null, 2)
    );

    // Log summary to console
    console.log("\nTest Summary:");
    console.log(`Total Tests: ${testResults.summary.totalTests}`);
    console.log(`Passed: ${testResults.summary.passed}`);
    console.log(`Failed: ${testResults.summary.failed}`);
    console.log(`Skipped: ${testResults.summary.skipped}`);
    console.log(`Duration: ${testResults.summary.duration}ms\n`);
  }
}

export default CustomReporter;
