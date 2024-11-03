document.addEventListener('DOMContentLoaded', () => {
    // Existing code to populate month and year dropdowns
    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year');
    const currentYear = new Date().getFullYear();

    // Populate month dropdown with current and future months
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement('option');
        option.value = month.toString().padStart(2, '0');
        option.text = new Date(0, month - 1).toLocaleString('default', { month: 'long' });
        monthSelect.add(option);
    }

    // Populate year dropdown with current and next year
    for (let year = currentYear - 1; year <= currentYear + 1; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.text = year;
        yearSelect.add(option);
    }

    // Fetch data from local storage
    const absenceData = JSON.parse(localStorage.getItem('absenceData')) || [];

    // Function to filter requests based on month and year
    function filterRequests() {
        const selectedMonth = monthSelect.value;
        const selectedYear = yearSelect.value;
        const requestsBody = document.getElementById('requests-body');
        requestsBody.innerHTML = ''; // Clear previous results
        
        absenceData.forEach(request => {
            const requestDate = new Date(request.date);
            if (requestDate.getMonth() + 1 === parseInt(selectedMonth) && requestDate.getFullYear() === parseInt(selectedYear)) {
                const row = `<tr>
                    <td>${request.employeeName}</td>
                    <td>${request.employeeId}</td>
                    <td>${request.date}</td>
                    <td>${request.reason}</td>
                </tr>`;
                requestsBody.innerHTML += row;
            }
        });
    }

    // Function to filter employee suggestions based on input
    function filterEmployees() {
        const input = document.getElementById('employee-search').value.toLowerCase();
        const suggestionsList = document.getElementById('suggestions');
        suggestionsList.innerHTML = ''; // Clear previous suggestions

        if (input.length === 0) return;

        absenceData.forEach(request => {
            if (request.employeeName.toLowerCase().includes(input) || request.employeeId.includes(input)) {
                const suggestionItem = document.createElement('li');
                suggestionItem.textContent = `${request.employeeName} (ID: ${request.employeeId})`;
                suggestionsList.appendChild(suggestionItem);
            }
        });
    }

    // Add event listeners to dropdowns
    monthSelect.addEventListener('change', filterRequests);
    yearSelect.addEventListener('change', filterRequests);
    
    // Attach the filterEmployees function to the input event
    document.getElementById('employee-search').addEventListener('input', filterEmployees);

    // Initial load of requests
    filterRequests();
});
