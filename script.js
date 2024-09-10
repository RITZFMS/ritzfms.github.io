document.addEventListener("DOMContentLoaded", async function () {
    const response = await fetch("config.json");
    const config = await response.json();

    const insuranceResponse = await fetch("insurance-fees.json");
    const insuranceData = await insuranceResponse.json();

    document.getElementById("calculate").addEventListener("click", calculate);

    async function calculate() {
        const age = parseInt(document.getElementById("age").value);
        const hourlyRate = parseFloat(document.getElementById("hourlyRate").value);
        
        const minFullTimeHours = config.minFullTimeHours;
        const incomePercentageThreshold = config.incomePercentageThreshold;
        const employeeContributionPercentage = config.employeeContributionPercentage;

        // Calculate values
        const monthlySalary = hourlyRate * minFullTimeHours;
        const maxMonthlyContribution = monthlySalary * (incomePercentageThreshold / 100);
        
        let employeeInsuranceFee = 0;
        
        // Check insurance fees
        for (const [range, fee] of Object.entries(insuranceData.insuranceFees)) {
            const [minAge, maxAge] = range.split('-').map(Number);
            if (maxAge && age >= minAge && age <= maxAge) {
                employeeInsuranceFee = fee * (employeeContributionPercentage / 100);
                break;
            } else if (!maxAge && age === minAge) {
                employeeInsuranceFee = fee * (employeeContributionPercentage / 100);
                break;
            }
        }

        // Default values for insurance fees out of range
        if (employeeInsuranceFee === 0) {
            alert("Insurance fee not found for this age.");
            return;
        }

        const requiredHourlyRate = employeeInsuranceFee / (minFullTimeHours * (incomePercentageThreshold / 100));

        // Update values on the page
        document.getElementById("monthlySalary").innerText = `$${monthlySalary.toFixed(2)}`;
        document.getElementById("insuranceFee").innerText = `$${employeeInsuranceFee.toFixed(2)}`;
        document.getElementById("maxMonthlyContribution").innerText = `$${maxMonthlyContribution.toFixed(2)}`;
        document.getElementById("requiredRate").innerText = `$${requiredHourlyRate.toFixed(2)}`;

        const meetsRequirement = hourlyRate >= requiredHourlyRate ? "Meets Requirement" : "Does Not Meet Requirement";
        document.getElementById("meetsRequirement").innerText = meetsRequirement;
    }
});
