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

    // Determine the insurance fee based on the age
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

    // Monthly salary based on minimum full-time hours
    const monthlySalary = hourlyRate * minFullTimeHours;

    // Calculate maximum monthly contribution
    const maxMonthlyContribution = monthlySalary * incomePercentageThreshold;

    // Required hourly rate
    const requiredHourlyRate = Math.ceil((insuranceFee * employeeContributionPercentage) / (minFullTimeHours * incomePercentageThreshold) * 100) / 100;

    // Determine if the employee meets the requirement
    const meetsRequirement = hourlyRate >= requiredHourlyRate ? "Meets Requirement" : "Does Not Meet Requirement";

    // Display results
    document.getElementById("insuranceFee").innerText = `$${insuranceFee.toFixed(2)}`;
    document.getElementById("maxMonthlyContribution").innerText = `$${maxMonthlyContribution.toFixed(2)}`;
    document.getElementById("requiredHourlyRate").innerText = `$${requiredHourlyRate.toFixed(2)}`;
    document.getElementById("meetsRequirement").innerText = meetsRequirement;
}
