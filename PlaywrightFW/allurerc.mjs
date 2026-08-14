import { defineConfig } from 'allure';

export default defineConfig({
    name: "Allure Report",
    output: "./reports/allure-report",
    historyPath: "./history.jsonl",
    qualityGate: {
        rule: [
            {
                maxFailures: 5,
                fastFail: true
            }
        ]
    },
    plugins: {
        awesome: {
            options: {
                reportName: "Automation Test Report - Details",
                singleFile: true,
                reportLanguage: "en",
                open: false,
                public: true
            }
        },
        log: {
            options: {
                groupBy: "none"
            }
        }
    },
    variables: {},
    environments: {}
});