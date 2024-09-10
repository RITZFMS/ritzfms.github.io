async function loadJSON(file) {
    const response = await fetch(file);
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

    // Perform further calculations here...
    const monthlySalary = hourlyRate * minFullTimeHours;
    const employeeInsuranceFee = insuranceFee * (employeeContributionPercentage / 100);
    const maxMonthlyContribution = (incomePercentageThreshold / 100) * monthlySalary;
    const requiredHourlyRate = employeeInsuranceFee / (minFullTimeHours * (incomePercentageThreshold / 100));

    // Update HTML with calculated values
    document.getElementById("monthlySalary").innerText = `$${monthlySalary.toFixed(2)}`;
    document.getElementById("insuranceFee").innerText = `$${employeeInsuranceFee.toFixed(2)}`;
    document.getElementById("maxContribution").innerText = `$${maxMonthlyContribution.toFixed(2)}`;
    document.getElementById("requiredRate").innerText = `$${requiredHourlyRate.toFixed(2)}`;

    // Determine if meets requirement
    const meetsRequirement = hourlyRate >= requiredHourlyRate ? "Meets Requirement" : "Does Not Meet Requirement";
    document.getElementById("requirement").innerText = meetsRequirement;
}

// Attach calculate function to the button
document.getElementById("calculateBtn").addEventListener("click", calculate);
