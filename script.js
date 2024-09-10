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

    let insuranceFee = 0;

    console.log('User Age:', age);
    console.log('Insurance Data:', insuranceData.insuranceFees);

    // Iterate over the ranges
    for (const range in insuranceData.insuranceFees) {
        const [minAge, maxAge] = range.split('-').map(Number);
        
        // Handle age ranges like 0-14, 64-99, and 100-199
        if (maxAge && age >= minAge && age <= maxAge) {
            insuranceFee = insuranceData.insuranceFees[range];
            console.log(`Matching range found: ${range}, Fee: ${insuranceFee}`);
            break;
        } else if (!maxAge && age === minAge) {
            insuranceFee = insuranceData.insuranceFees[range];
            console.log(`Exact age match found: ${range}, Fee: ${insuranceFee}`);
            break;
        }
    }

    // If insuranceFee is not found, show an alert
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
