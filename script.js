document.addEventListener("DOMContentLoaded", async function () {
    const response = await fetch("config.json");
    const config = await response.json();

    const insuranceResponse = await fetch("insurance-fees.json");
    const insuranceData = await insuranceResponse.json();

    document.getElementById("calculateBtn").addEventListener("click", calculate);

    function getInsuranceFeeByAge(age, insuranceData) {
        if (age >= 0 && age <= 14) {
            return insuranceData["0-14"];
        } else if (age >= 64 && age <= 99) {
            return insuranceData["64-99"];
        } else if (age >= 100 && age <= 199) {
            return insuranceData["100-199"];
        } else {
            return insuranceData[age.toString()] || 0; // Fallback for specific ages if they exist as exact values
        }
    }

    async function calculate() {
        try {
            const age = parseInt(document.getElementById("age").value);
            const hourlyRate = parseFloat(document.getElementById("hourlyRate").value);

            const minFullTimeHours = config.minFullTimeHours;
            const incomePercentageThreshold = config.incomePercentageThreshold / 100;
            const employeeContributionPercentage = config.employeeContributionPercentage / 100;

            // Calculate values
            const monthlySalary = hourlyRate * minFullTimeHours;
            const maxMonthlyContribution = Math.ceil((monthlySalary * incomePercentageThreshold) * 100) / 100;

            // Insurance fee logic with age range handling
            let employeeInsuranceFee = 0;
            const insuranceFee = getInsuranceFeeByAge(age, insuranceData);

            if (insuranceFee) {
                employeeInsuranceFee = Math.ceil((insuranceFee * employeeContributionPercentage) * 100) / 100;
            }

            const requiredHourlyRate = Math.ceil((employeeInsuranceFee / (minFullTimeHours * incomePercentageThreshold)) * 100) / 100;

            // Debug output for checking the values
            console.log("Age:", age);
            console.log("Hourly Rate:", hourlyRate);
            console.log("Monthly Salary:", monthlySalary);
            console.log("Income Percentage Threshold:", incomePercentageThreshold);
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
