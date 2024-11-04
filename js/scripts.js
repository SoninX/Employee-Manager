const generateUniqueId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const formatDate = (date) => new Date(date).toLocaleDateString('en-GB');

const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
};

// Form Handling for Leave Application
document.addEventListener('DOMContentLoaded', () => {
    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year');

    // Populate Month and Year Dropdowns
    if (monthSelect && yearSelect) {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        for (let i = 0; i < 12; i++) {
            const option = document.createElement('option');
            option.value = (i + 1).toString().padStart(2, '0');
            option.text = new Date(0, i).toLocaleString('default', { month: 'long' });
            monthSelect.add(option);
        }
        monthSelect.value = (currentMonth + 1).toString().padStart(2, '0');

        for (let year = currentYear - 1; year <= currentYear + 1; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.text = year;
            yearSelect.add(option);
        }
        yearSelect.value = currentYear;
    }

    // Handle Leave Application Form Submission
    const leaveForm = document.getElementById('leave-form');
    if (leaveForm) {
        leaveForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = {
                id: generateUniqueId(),
                employeeName: document.getElementById('employee-name').value,
                employeeId: document.getElementById('employee-id').value,
                department: document.getElementById('department').value,
                date: document.getElementById('date').value,
                shift: document.getElementById('shift').value,
                outTime: document.getElementById('out-time').value,
                inTime: document.getElementById('in-time').value,
                duration: document.getElementById('sa-minutes').value,
                reason: document.getElementById('reason').value = currentRequestData.reason;
                remarks: document.getElementById('remarks').value,
                status: 'pending',
                submittedAt: new Date().toISOString(),
                rejectionReason: ''
            };

            if (!formData.employeeName || !formData.employeeId || !formData.date) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            const existingData = JSON.parse(localStorage.getItem('leaveRequests')) || [];
            existingData.push(formData);
            localStorage.setItem('leaveRequests', JSON.stringify(existingData));

            showNotification('Leave request submitted successfully');
            setTimeout(() => {
                window.location.href = 'employee-home.html';
            }, 2000);
        });
    }

    // Handle Admin Approval Page
    const requestsTable = document.getElementById('requests-table');
    if (requestsTable) {
        const filterRequests = () => {
            const selectedMonth = monthSelect.value;
            const selectedYear = yearSelect.value;
            const searchInput = document.getElementById('employee-search')?.value.toLowerCase();
            const requests = JSON.parse(localStorage.getItem('leaveRequests')) || [];

            const filteredRequests = requests.filter(request => {
                const requestDate = new Date(request.date);
                const monthMatch = !selectedMonth || (requestDate.getMonth() + 1) === parseInt(selectedMonth);
                const yearMatch = !selectedYear || requestDate.getFullYear() === parseInt(selectedYear);
                const searchMatch = !searchInput ||
                    request.employeeName.toLowerCase().includes(searchInput) ||
                    request.employeeId.toLowerCase().includes(searchInput);

                return monthMatch && yearMatch && searchMatch;
            });

            renderRequestsTable(filteredRequests);
        };

        const renderRequestsTable = (requests) => {
            const tbody = document.getElementById('requests-body');
            tbody.innerHTML = '';

            requests.forEach(request => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${request.employeeName}</td>
                    <td>${request.employeeId}</td>
                    <td>${formatDate(request.date)}</td>
                    <td>${request.reason}</td>
                    <td><button onclick="viewRequest('${request.id}')" class="view-btn">View Details</button></td>
                `;
                tbody.appendChild(row);
            });
        };

        monthSelect?.addEventListener('change', filterRequests);
        yearSelect?.addEventListener('change', filterRequests);
        document.getElementById('employee-search')?.addEventListener('input', filterRequests);

        filterRequests();
    }

    // Handle Loading Request Details on Admin Approval Page
    const currentRequestData = JSON.parse(localStorage.getItem('currentRequest'));
    if (currentRequestData) {
        document.getElementById('employee-name').innerText = currentRequestData.employeeName;
        document.getElementById('employee-id').innerText = currentRequestData.employeeId;
        document.getElementById('department').innerText = currentRequestData.department;
        document.getElementById('date').innerText = formatDate(currentRequestData.date);
        document.getElementById('shift').innerText = currentRequestData.shift;
        document.getElementById('out-time').innerText = currentRequestData.outTime;
        document.getElementById('in-time').innerText = currentRequestData.inTime;
        document.getElementById('sa-minutes').innerText = currentRequestData.duration;
        document.getElementById('reason').value = currentRequestData.reason;
        document.getElementById('remarks').innerText = currentRequestData.remarks;
        document.getElementById('status-message').innerText = currentRequestData.status;
    }
});

// Admin Approval Functions
function viewRequest(requestId) {
    const requests = JSON.parse(localStorage.getItem('leaveRequests')) || [];
    const request = requests.find(r => r.id === requestId);

    if (request) {
        localStorage.setItem('currentRequest', JSON.stringify(request));
        window.location.href = 'admin-approval.html';
    }
}

function handleApproval(isApproved) {
    const request = JSON.parse(localStorage.getItem('currentRequest'));
    const requests = JSON.parse(localStorage.getItem('leaveRequests')) || [];

    const index = requests.findIndex(r => r.id === request.id);

    if (index !== -1) {
        if (isApproved) {
            requests[index].status = 'approved';
            localStorage.setItem('leaveRequests', JSON.stringify(requests));
            showNotification('Request approved successfully');
            setTimeout(() => window.location.href = 'admin-employees.html', 2000);
        } else {
            const rejectionReason = prompt("Please provide a rejection reason:");
            if (rejectionReason) {
                requests[index].status = 'rejected';
                requests[index].rejectionReason = rejectionReason;
                localStorage.setItem('leaveRequests', JSON.stringify(requests));
                showNotification('Request rejected successfully');
                setTimeout(() => window.location.href = 'admin-employees.html', 2000);
            }
        }
    }
}
