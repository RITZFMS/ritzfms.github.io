// Wait for the DOM to fully load before attaching event listeners
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");

    const calculateBtn = document.getElementById("calculateBtn");

    if (calculateBtn) {
        console.log("Button found");
        calculateBtn.addEventListener("click", calculate);
    } else {
        console.log("Button not found");
    }
});

// Ensure that the calculate function is defined
async function calculate() {
    console.log("Calculate function called");

    const age = parseInt(document.getElementById("age").value);
    const hourlyRate = parseFloat(document.getElementById("hourlyRate").value);

    if (isNaN(age) || isNaN(hourlyRate)) {
        alert("Please enter valid age and hourly rate.");
        return;
    }

    try {
        // Load configuration and insurance fee data
        const config = await loadJSON("config.json");
        const insuranceData = await loadJSON("insurance-fees.json");

        const minFullTimeHours = config.minFullTimeHours;
        const incomePercentageThreshold = config.incomePercentageThreshold;
        const employeeContributionPercentage = config.employeeContributionPercentage;

        let insuranceFee = 0;

        // Iterate over the ranges in the insurance-fees.json file
        for (const range in insuranceData.insuranceFees) {
            const [minAge, maxAge] = range.split("-").map(Number);

            // Check if age falls within a range
            if (maxAge && age >= minAge && age <= maxAge) {
                insuranceFee = insuranceData.insuranceFees[range];
                break;
            }

            // Check for an exact match (e.g., age 15, 16)
            else if (!maxAge && age === minAge) {
                insuranceFee = insuranceData.insuranceFees[range];
                break;
            }
        }

        if (insuranceFee === 0) {
            alert("Insurance fee not found for this age.");
            return;
        }

        const monthlySalary = hourlyRate * minFullTimeHours;
        const maxMonthlyContribution = (monthlySalary * incomePercentageThreshold) / 100;
        const employeeContribution = (insuranceFee * employeeContributionPercentage) / 100;
        const requiredHourlyRate = (insuranceFee / minFullTimeHours) / (incomePercentageThreshold / 100);

        document.getElementById("monthlySalary").innerText = `$${monthlySalary.toFixed(2)}`;
        document.getElementById("maxContribution").innerText = `$${maxMonthlyContribution.toFixed(2)}`;
        document.getElementById("insuranceFee").innerText = `$${employeeContribution.toFixed(2)}`;
        document.getElementById("requiredHourlyRate").innerText = `$${requiredHourlyRate.toFixed(2)}`;

        const meetsRequirement = (employeeContribution <= maxMonthlyContribution);
        document.getElementById("meetsRequirement").innerText = meetsRequirement ? "Meets Requirement" : "Does Not Meet Requirement";
    } catch (error) {
        console.error("Error in calculation:", error);
    }
}

// Helper function to load JSON files
async function loadJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load JSON from ${url}: ${response.statusText}`);
    }
    return response.json();
}
