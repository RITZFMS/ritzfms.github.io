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

                // Get insurance fee based on age
                for (const range in insuranceData.insuranceFees) {
                    const [minAge, maxAge] = range.split("-").map(Number);
                    if (age >= minAge && age <= maxAge) {
                        employeeInsuranceFee = insuranceData.insuranceFees[range];
                        break;
                    }
                }

                // Calculate contribution and required hourly rate
                const employeeContribution = (employeeInsuranceFee * employeeContributionPercentage) / 100;
                const requiredHourlyRate = (employeeInsuranceFee / minFullTimeHours) / (incomePercentageThreshold / 100);

                // Update DOM
                document.getElementById("monthlySalary").innerText = `$${monthlySalary.toFixed(2)}`;
                document.getElementById("insuranceFee").innerText = `$${employeeContribution.toFixed(2)}`;
                document.getElementById("maxContribution").innerText = `$${maxMonthlyContribution.toFixed(2)}`;
                document.getElementById("requiredHourlyRate").innerText = `$${Math.ceil(requiredHourlyRate * 100) / 100}`;

                const meetsRequirement = employeeContribution <= maxMonthlyContribution;
                document.getElementById("meetsRequirement").innerText = meetsRequirement ? "Meets Requirement" : "Does Not Meet Requirement";
            } catch (error) {
                console.error("Error in calculation:", error);
            }
        }
    } catch (error) {
        console.error("Error loading configuration or insurance data:", error);
    }
});
