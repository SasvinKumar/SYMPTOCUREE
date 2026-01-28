// Age category buttons
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// Backend API connection
document.getElementById('symptomForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const symptoms = document.getElementById('symptoms').value.trim();
    const gender = document.getElementById('gender').value;
    const age = document.querySelector('.category-btn.active').dataset.category;
    
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '🔗 Connecting to Backend...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symptoms, age, gender })
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        displayResults(data);
        
    } catch (error) {
        console.error('Backend Error:', error);
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

function displayResults(data) {
    // Confidence
    document.getElementById('confidence-text').innerHTML = 
        `✅ <strong>${data.confidence}%</strong> Confidence<br>
         (${data.profile.gender}, ${data.profile.age}) - ${data.matchedSymptoms}/${data.totalSymptoms} symptoms matched`;
    
    document.getElementById('confidence-fill').style.width = data.confidence + '%';
    
    // Related symptoms
    document.getElementById('related-symptoms').innerHTML = 
        data.relatedSymptoms.length ? 
        data.relatedSymptoms.map(s => `<li>${s}</li>`).join('') :
        '<li>✨ No additional symptoms detected</li>';
    
    // Conditions
    document.getElementById('conditions').innerHTML = 
        data.conditions.length ? 
        data.conditions.map(c => `<li>${c}</li>`).join('') :
        '<li>📋 No specific conditions matched</li>';
    
    // Medications
    const medsContainer = document.getElementById('medications');
    if (data.medications.length) {
        medsContainer.innerHTML = data.medications.map(med => `
            <div class="med-card">
                <h4>💊 ${med.name}</h4>
                <div class="dosage">
                    <strong>📋 Dosage:</strong> ${med.dosage}<br>
                    <strong>⚠️ Notes:</strong> ${med.notes}
                    ${med.genderNote ? `<br><strong>♀️♂️ Gender Note:</strong> ${med.genderNote}` : ''}
                </div>
            </div>
        `).join('');
    } else {
        medsContainer.innerHTML = `
            <div style="text-align:center;padding:40px;color:#9370DB;">
                <h3>🌸 No specific medications found</h3>
                <p>Try different symptom combinations for better matches</p>
            </div>
        `;
    }
    
    document.getElementById('results').style.display = 'block';
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    
    document.querySelector('.submit-btn').innerHTML = '✅ Analysis Complete! ✨';
    setTimeout(() => {
        document.querySelector('.submit-btn').innerHTML = '🔗 Analyze Again';
        document.querySelector('.submit-btn').disabled = false;
    }, 3000);
}
