document.addEventListener("DOMContentLoaded", async function () {
    const response = await fetch("config.json");
    const config = await response.json();

    const insuranceResponse = await fetch("insurance-fees.json");
    const insuranceData = await insuranceResponse.json();

    document.getElementById("calculateBtn").addEventListener("click", calculate);

    async function calculate() {
        try {
            const age = parseInt(document.getElementById("age").value);
            const hourlyRate = parseFloat(document.getElementById("hourlyRate").value);

            const minFullTimeHours = config.minFullTimeHours;
            const incomePercentageThreshold = config.incomePercentageThreshold; // No division by 100
            const employeeContributionPercentage = config.employeeContributionPercentage; // No division by 100

            // Calculate values
            const monthlySalary = hourlyRate * minFullTimeHours;
            const maxMonthlyContribution = Math.ceil((monthlySalary * incomePercentageThreshold) * 100) / 100; // Rounded to the nearest cent

            // Insurance fee logic
            let employeeInsuranceFee = 0;
            if (age in insuranceData.insuranceFees) {
                const insuranceFee = insuranceData.insuranceFees[age];
                employeeInsuranceFee = Math.ceil((insuranceFee * employeeContributionPercentage) * 100) / 100; // Rounded to the nearest cent
            }

            const requiredHourlyRate = Math.ceil((employeeInsuranceFee / (minFullTimeHours * incomePercentageThreshold)) * 100) / 100; // Rounded to the nearest cent

            // Debug output for checking the values
            console.log("Age:", age);
            console.log("Hourly Rate:", hourlyRate);
            console.log("Monthly Salary:", monthlySalary);
            console.log("Income Percentage Threshold:", incomePercentageThreshold); // Keep as is
            console.log("Max Monthly Contribution:", maxMonthlyContribution);
            console.log("Insurance Fee (Employee Contribution):", employeeInsuranceFee);
            console.log("Required Hourly Rate:", requiredHourlyRate);

            // Update the DOM elements with calculated values
            document.getElementById("monthlySalary").innerText = `$${monthlySalary.toFixed(2)}`;
            document.getElementById("insuranceFee").innerText = `$${employeeInsuranceFee.toFixed(2)}`;
            document.getElementById("maxContribution").innerText = `$${maxMonthlyContribution.toFixed(2)}`;
            document.getElementById("requiredHourlyRate").innerText = `$${requiredHourlyRate.toFixed(2)}`;

            const meetsRequirement = (hourlyRate >= requiredHourlyRate) ? "Meets Requirement" : "Does Not Meet Requirement";
            document.getElementById("meetsRequirement").innerText = meetsRequirement;
        } catch (error) {
            console.error("Error in calculation:", error);
        }
    }
});
