document.addEventListener("DOMContentLoaded", async function () {
    try {
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
                const incomePercentageThreshold = config.incomePercentageThreshold;
                const employeeContributionPercentage = config.employeeContributionPercentage;

                // Calculate values
                const monthlySalary = hourlyRate * minFullTimeHours;
                const maxMonthlyContribution = monthlySalary * (incomePercentageThreshold / 100);
                let employeeInsuranceFee = 0;

                // Lookup insurance fee
                for (const range in insuranceData.insuranceFees) {
                    const [minAge, maxAge] = range.split("-").map(Number);
                    if (age >= minAge && age <= maxAge) {
                        employeeInsuranceFee = insuranceData.insuranceFees[range];
                        break;
                    }
                }

                const employeeContribution = employeeInsuranceFee * (employeeContributionPercentage / 100);
                const requiredHourlyRate = (employeeInsuranceFee / minFullTimeHours) / (incomePercentageThreshold / 100);

                // Update UI with calculated values
                document.getElementById("monthlySalary").innerText = `$${monthlySalary.toFixed(2)}`;
                document.getElementById("maxContribution").innerText = `$${maxMonthlyContribution.toFixed(2)}`;
                document.getElementById("insuranceFee").innerText = `$${employeeContribution.toFixed(2)}`;
                document.getElementById("requiredHourlyRate").innerText = `$${requiredHourlyRate.toFixed(2)}`;

                const meetsRequirement = hourlyRate >= requiredHourlyRate ? "Meets Requirement" : "Does Not Meet Requirement";
                document.getElementById("meetsRequirement").innerText = meetsRequirement;
            } catch (error) {
                console.error("Error in calculation:", error);
            }
        }
    } catch (error) {
        console.error("Error loading config or insurance data:", error);
    }
});
