document.addEventListener("DOMContentLoaded", async function () {
    // Load config and insurance data
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
            const incomePercentageThreshold = config.incomePercentageThreshold / 100;
            const employeeContributionPercentage = config.employeeContributionPercentage / 100;

            // Calculate values
            const monthlySalary = hourlyRate * minFullTimeHours;
            let insuranceFee = 0;

            // Get insurance fee from JSON data based on age
            if (age >= 0 && age <= 99) {
                insuranceFee = insuranceData.insuranceFees[`${age}`] || insuranceData.insuranceFees["64-99"];
            } else {
                insuranceFee = insuranceData.insuranceFees["100-199"];
            }

            // Employee's insurance fee contribution
            const employeeInsuranceFee = insuranceFee * employeeContributionPercentage;

            // Maximum monthly contribution (rounded to the nearest cent)
            const maxMonthlyContribution = Math.round((monthlySalary * incomePercentageThreshold) * 100) / 100;

            // Required hourly rate (rounded to the nearest cent)
            const requiredHourlyRate = Math.round((employeeInsuranceFee / (minFullTimeHours * incomePercentageThreshold)) * 100) / 100;

            // Update the DOM elements with calculated values
            document.getElementById("monthlySalary").innerText = `$${monthlySalary.toFixed(2)}`;
            document.getElementById("maxContribution").innerText = `$${maxMonthlyContribution.toFixed(2)}`;
            document.getElementById("insuranceFee").innerText = `$${employeeInsuranceFee.toFixed(2)}`;
            document.getElementById("requiredHourlyRate").innerText = `$${requiredHourlyRate.toFixed(2)}`;

            const meetsRequirement = employeeInsuranceFee <= maxMonthlyContribution;
            document.getElementById("meetsRequirement").innerText = meetsRequirement ? "Meets Requirement" : "Does Not Meet Requirement";
        } catch (error) {
            console.error("Error in calculation:", error);
        }
    }
});
