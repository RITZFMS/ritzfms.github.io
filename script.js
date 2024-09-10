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
            const incomePercentageThreshold = config.incomePercentageThreshold / 100;
            const employeeContributionPercentage = config.employeeContributionPercentage / 100;

            // Calculate values
            const monthlySalary = hourlyRate * minFullTimeHours;
            const maxMonthlyContribution = Math.ceil((monthlySalary * incomePercentageThreshold) * 100) / 100;

            // Ensure proper decimal placement for insurance fees
            let employeeInsuranceFee = 0;
            if (age in insuranceData.insuranceFees) {
                const insuranceFee = insuranceData.insuranceFees[age];
                employeeInsuranceFee = insuranceFee * employeeContributionPercentage;
            }

            const requiredHourlyRate = Math.ceil((employeeInsuranceFee / (minFullTimeHours * incomePercentageThreshold)) * 100) / 100;

            // Debug output for understanding the calculation flow
            console.log("Age:", age);
            console.log("Hourly Rate:", hourlyRate);
            console.log("Monthly Salary:", monthlySalary);
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
