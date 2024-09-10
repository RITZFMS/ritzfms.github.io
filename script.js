// Load JSON data
async function loadJSON(url) {
    const response = await fetch(url);
    return await response.json();
}

async function calculate() {
    try {
        const age = parseInt(document.getElementById("age").value);
        const hourlyRate = parseFloat(document.getElementById("hourlyRate").value);

        // Load configuration and insurance fee data
        const config = await loadJSON('config.json');
        const insuranceData = await loadJSON('insurance-fees.json');

        const minFullTimeHours = config.minFullTimeHours;
        const incomePercentageThreshold = config.incomePercentageThreshold;
        const employeeContributionPercentage = config.employeeContributionPercentage;

        let insuranceFee = 0;

        // Iterate over the ranges
        for (const range in insuranceData.insuranceFees) {
            const [minAge, maxAge] = range.split('-').map(Number);

            // Handle ranges (e.g., 0-14, 64-99, 100-199)
            if (maxAge && age >= minAge && age <= maxAge) {
                insuranceFee = insuranceData.insuranceFees[range];
                break;
            }
            // Handle exact age matches (e.g., 15, 16)
            else if (!maxAge && age === minAge) {
                insuranceFee = insuranceData.insuranceFees[range];
                break;
            }
        }

        if (insuranceFee === 0) {
            alert("Insurance fee not found for this age.");
            return;
        }

        // Calculate the employee's contribution (30% of total fee)
        const employeeInsuranceFee = insuranceFee * employeeContributionPercentage;

        // Calculate monthly salary based on min hours
        const monthlySalary = hourlyRate * minFullTimeHours;

        // Calculate maximum monthly contribution (8.39% of monthly salary)
        const maxMonthlyContribution = monthlySalary * incomePercentageThreshold;

        // Calculate required hourly rate
        const requiredHourlyRate = employeeInsuranceFee / (minFullTimeHours * incomePercentageThreshold);

        // Determine if the employee meets the requirement
        const meetsRequirement = hourlyRate >= requiredHourlyRate ? "Meets Requirement" : "Does Not Meet Requirement";

        // Update the UI with corrected values
        document.getElementById("monthlySalary").innerText = `$${monthlySalary.toFixed(2)}`;
        document.getElementById("insuranceFee").innerText = `$${employeeInsuranceFee.toFixed(2)}`;
        document.getElementById("maxMonthlyContribution").innerText = `$${maxMonthlyContribution.toFixed(2)}`;
        document.getElementById("requiredHourlyRate").innerText = `$${requiredHourlyRate.toFixed(2)}`;
        document.getElementById("meetsRequirement").innerText = meetsRequirement;
    } catch (error) {
        console.error("Error in calculation:", error);
    }
}

// Attach calculate function to the button
document.getElementById("calculateBtn").addEventListener("click", calculate);
