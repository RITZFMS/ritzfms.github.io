// Load JSON data
async function loadJSON(url) {
    const response = await fetch(url);
    return await response.json();
}

async function calculate() {
    const age = parseInt(document.getElementById("age").value);
    const hourlyRate = parseFloat(document.getElementById("hourlyRate").value);

    // Load configuration and insurance fee data
    const config = await loadJSON('config.json');
    const insuranceData = await loadJSON('insurance-fees.json');

    const minFullTimeHours = config.minFullTimeHours;
    const incomePercentageThreshold = config.incomePercentageThreshold;
    const employeeContributionPercentage = config.employeeContributionPercentage;

    // Find the insurance fee based on age for the Silver 70 HMO plan
    let insuranceFee = 0;
    for (const range in insuranceData.insuranceFees) {
        const [minAge, maxAge] = range.split('-').map(Number);
        if (!maxAge) {
            if (age === minAge) {
                insuranceFee = insuranceData.insuranceFees[range];
                break;
            }
        } else if (age >= minAge && age <= maxAge) {
            insuranceFee = insuranceData.insuranceFees[range];
            break;
        }
    }

    // Calculate the employee's contribution for the insurance fee (30% of total)
    const employeeInsuranceFee = insuranceFee * employeeContributionPercentage;

    // Monthly salary based on minimum full-time hours
    const monthlySalary = hourlyRate * minFullTimeHours;

    // Calculate maximum monthly contribution (8.39% of monthly salary)
    const maxMonthlyContribution = monthlySalary * incomePercentageThreshold;

    // Calculate required hourly rate
    const requiredHourlyRate = Math.ceil((insuranceFee * employeeContributionPercentage) / (minFullTimeHours * incomePercentageThreshold) * 100) / 100;

    // Determine if the employee meets the requirement
    const meetsRequirement = hourlyRate >= requiredHourlyRate ? "Meets Requirement" : "Does Not Meet Requirement";

    // Update the UI with calculated values
    document.getElementById("monthlySalary").innerText = `$${monthlySalary.toFixed(2)}`;
    document.getElementById("insuranceFee").innerText = `$${employeeInsuranceFee.toFixed(2)}`;
    document.getElementById("maxMonthlyContribution").innerText = `$${maxMonthlyContribution.toFixed(2)}`;
    document.getElementById("requiredHourlyRate").innerText = `$${requiredHourlyRate.toFixed(2)}`;
    document.getElementById("meetsRequirement").innerText = meetsRequirement;
}
