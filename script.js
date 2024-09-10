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

    // Fix: Correct insurance fee lookup based on exact age and handling ranges
    let insuranceFee = 0;
    for (const range in insuranceData.insuranceFees) {
        const [minAge, maxAge] = range.split('-').map(Number);
        // Handle exact matches and ranges where maxAge could be 99
        if ((maxAge && age >= minAge && age <= maxAge) || (!maxAge && age === minAge)) {
            insuranceFee = insuranceData.insuranceFees[range];
            break;
        }
    }

    // Calculate the employee's contribution (30% of total fee)
    const employeeInsuranceFee = insuranceFee * employeeContributionPercentage;

    // Calculate monthly salary based on min hours
    const monthlySalary = hourlyRate * minFullTimeHours;

    // Calculate maximum monthly contribution (8.39% of monthly salary)
    const maxMonthlyContribution = monthlySalary * incomePercentageThreshold;

    // Calculate required hourly rate
    const requiredHourlyRate = Math.ceil((insuranceFee * employeeContributionPercentage) / (minFullTimeHours * incomePercentageThreshold) * 100) / 100;

    // Determine if the employee meets the requirement
    const meetsRequirement = hourlyRate >= requiredHourlyRate ? "Meets Requirement" : "Does Not Meet Requirement";

    // Update the UI with corrected values
    document.getElementById("monthlySalary").innerText = `$${monthlySalary.toFixed(2)}`;
    document.getElementById("insuranceFee").innerText = `$${employeeInsuranceFee.toFixed(2)}`;
    document.getElementById("maxMonthlyContribution").innerText = `$${maxMonthlyContribution.toFixed(2)}`;
    document.getElementById("requiredHourlyRate").innerText = `$${requiredHourlyRate.toFixed(2)}`;
    document.getElementById("meetsRequirement").innerText = meetsRequirement;
}
