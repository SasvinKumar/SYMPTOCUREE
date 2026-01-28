// Age buttons
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Backend connection
document.getElementById('symptomForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const symptoms = document.getElementById('symptoms').value;
    const gender = document.getElementById('gender').value;
    const age = document.querySelector('.category-btn.active').dataset.category;
    
    const btn = document.querySelector('.submit-btn');
    btn.innerHTML = '🔗 Connecting Backend...';
    btn.disabled = true;
    
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symptoms, age, gender })
        });
        
        const data = await response.json();
        displayResults(data);
        
    } catch (error) {
        alert('Backend Error - Check if server is running!');
        btn.innerHTML = '🔗 AI Analysis';
        btn.disabled = false;
    }
});

function displayResults(data) {
    document.getElementById('confidence-text').innerHTML = `✅ ${data.confidence}% (${data.profile.gender}, ${data.profile.age})`;
    document.getElementById('confidence-fill').style.width = data.confidence + '%';
    
    document.getElementById('related-symptoms').innerHTML = data.relatedSymptoms.map(s => `<li>${s}</li>`).join('') || '<li>No matches</li>';
    document.getElementById('conditions').innerHTML = data.conditions.map(c => `<li>${c}</li>`).join('') || '<li>No conditions</li>';
    
    const medsHtml = data.medications.map(med => `
        <div class="med-card">
            <h4>💊 ${med.name}</h4>
            <div class="dosage">
                <strong>Dosage:</strong> ${med.dosage}<br>
                <strong>Notes:</strong> ${med.notes}
            </div>
        </div>
    `).join('');
    
    document.getElementById('medications').innerHTML = medsHtml || '<p>No medications found</p>';
    document.getElementById('results').style.display = 'block';
    document.querySelector('.submit-btn').innerHTML = '✅ Complete!';
}
