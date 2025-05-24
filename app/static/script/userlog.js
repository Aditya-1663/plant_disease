let mockData = [];

async function fetchData() {
    try {
        const response = await fetch('/getuserlog'); 
        const data = await response.json();
        mockData = data;
        filteredData = [...mockData];
        renderTable();
        updateStats();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    fetchData(); // Load from Flask
    setupEventListeners();
});

let currentPage = 1;
const itemsPerPage = 5;
let filteredData = [...mockData];

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    setupEventListeners();
    updateStats();
});

function setupEventListeners() {
    // Filter event listeners
    document.getElementById('dateFilter').addEventListener('change', applyFilters);
    document.getElementById('locationFilter').addEventListener('change', applyFilters);
    document.getElementById('diseaseFilter').addEventListener('change', applyFilters);
    document.getElementById('searchBtn').addEventListener('click', applyFilters);
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });

    // Pagination
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });

    // Export button
    document.getElementById('exportBtn').addEventListener('click', exportData);

    // Modal
    const modal = document.getElementById('detailModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function renderTable() {
    const tableBody = document.getElementById('tableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);

    tableBody.innerHTML = '';

    pageData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.datetime}</td>
            <td>${item.userId}</td>
            <td><i class="fas fa-map-marker-alt"></i> ${item.location}</td>
            <td>${item.plantname}</td>
            <td><strong>${item.disease}</strong></td>
           
            <td><button class="action-btn" onclick="showDetails(${item.id})">View Details</button></td>
        `;
        tableBody.appendChild(row);
    });

    updatePagination();
}

function getConfidenceClass(confidence) {
    if (confidence >= 85) return 'high';
    if (confidence >= 70) return 'medium';
    return 'low';
}

function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

function applyFilters() {
    const dateFilter = document.getElementById('dateFilter').value;
    const locationFilter = document.getElementById('locationFilter').value;
    const diseaseFilter = document.getElementById('diseaseFilter').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    filteredData = mockData.filter(item => {
        // Date filter
        if (dateFilter !== 'all') {
            const itemDate = new Date(item.datetime);
            const now = new Date();
            
            switch (dateFilter) {
                case 'today':
                    if (itemDate.toDateString() !== now.toDateString()) return false;
                    break;
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    if (itemDate < weekAgo) return false;
                    break;
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    if (itemDate < monthAgo) return false;
                    break;
            }
        }

        // Location filter
        if (locationFilter !== 'all') {
            const locationMap = {
                'india': 'India'
                
            };
            if (!item.location.includes(locationMap[locationFilter])) return false;
        }

        // Disease filter
        if (diseaseFilter !== 'all') {
            const diseaseMap = {
    'scab': 'Scab',
    'rot': 'Rot',
    'rust': 'Rust',
    'mildew': 'Mildew',
    'blight': 'Blight',
    'spot': 'Spot',
    'leaf spot': 'Leaf Spot',
    'leaf scorch': 'Scorch',
    'leaf mold': 'Mold',
    'measles': 'Measles',
    'curl': 'Curl Virus',
    'mosaic': 'Mosaic Virus',
    'mite': 'Mite',
    'greening': 'Citrus Greening',
    'bacterial': 'Bacterial',
    'virus': 'Virus',
    'healthy': 'Healthy'
};

            if (!item.disease.toLowerCase().includes(diseaseMap[diseaseFilter].toLowerCase())) return false;
        }

        // Search input
        if (searchInput) {
            const searchableText = `${item.userId} ${item.location} ${item.disease}`.toLowerCase();
            if (!searchableText.includes(searchInput)) return false;
        }

        return true;
    });

    currentPage = 1;
    renderTable();
    updateStats();
}

function showDetails(id) {
    const item = mockData.find(data => data.id === id);
    if (!item) return;

    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <div style="display: grid; gap: 20px;">
            <div>
                <h3>Search Information</h3>
                <p><strong>Date & Time:</strong> ${item.datetime}</p>
                <p><strong>User ID:</strong> ${item.userId}</p>
                <p><strong>Location:</strong> ${item.location}</p>
                <p><strong>plantname:</strong> ${item.plantname}</p>
            </div>
            <div>
                <h3>Detection Results</h3>
                <p><strong>Disease:</strong> ${item.disease}</p>
                
            </div>
            <div>
                <h3>Additional Details</h3>
                <p><strong>Crop Type:</strong> ${item.details.cropType}</p>
               
                <p><strong>Processing Time:</strong> ${item.details.processingTime}</p>
                
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

function updateStats() {
    const totalSearches = filteredData.length;
    // const diseasesDetected = filteredData.filter(item => item.status === 'detected').length;
    const diseasesDetected = filteredData.length;
    const uniqueLocations = new Set(filteredData.map(item => item.location.split(',')[1]?.trim())).size;
    const today = new Date().toDateString();
    const todaySearches = filteredData.filter(item => new Date(item.datetime).toDateString() === today).length;

    document.getElementById('totalSearches').textContent = totalSearches.toLocaleString();
    document.getElementById('diseasesDetected').textContent = diseasesDetected.toLocaleString();
    document.getElementById('uniqueLocations').textContent = uniqueLocations;
    document.getElementById('todaySearches').textContent = todaySearches;
}

function exportData() {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Date,User ID,Location,Search Type,Disease,Confidence,Status\n"
        + filteredData.map(item => 
            `"${item.datetime}","${item.userId}","${item.location}","${item.searchType}","${item.disease}",${item.confidence},"${item.status}"`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "plant_disease_searches.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Simulate real-time updates
// setInterval(() => {
//     // Add a new random search every 30 seconds (for demo purposes)
//     const newSearch = {
//         id: mockData.length + 1,
//         datetime: new Date().toISOString().slice(0, 19).replace('T', ' '),
//         userId: `USR${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
//         location: ['Maharashtra, India', 'California, USA', 'São Paulo, Brazil', 'Nairobi, Kenya'][Math.floor(Math.random() * 4)],
//         searchType: 'Image Upload',
//         disease: ['Late Blight', 'Healthy', 'Leaf Rust', 'Mosaic Virus'][Math.floor(Math.random() * 4)],
//         confidence: Math.floor(Math.random() * 40) + 60,
//         status: Math.random() > 0.3 ? 'detected' : 'healthy',
//         details: {
//             cropType: ['Tomato', 'Wheat', 'Coffee', 'Maize'][Math.floor(Math.random() * 4)],
//             imageSize: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
//             processingTime: `${(Math.random() * 2 + 0.5).toFixed(1)}s`,
//             recommendations: 'Follow recommended treatment protocol'
//         }
//     };
    
//     mockData.unshift(newSearch);
//     if (mockData.length > 50) mockData.pop(); // Keep only last 50 entries
    
//     applyFilters(); // Refresh the display
// }, 30000);