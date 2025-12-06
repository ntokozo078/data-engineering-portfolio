// Helper function to load and format profile data from data.json
async function loadProfileData() {
    try {
        const response = await fetch('/data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to load profile data:', error);
        return null;
    }
}

// Generate short responses from profile data
function generateResponse(data, query) {
    const lower = query.toLowerCase();

    if (lower.includes('skill') || lower.includes('technology') || lower.includes('tech stack')) {
        const skills = data.specialities.core.slice(0, 5).join(', ');
        return `I specialize in ${skills}. I build ETL/ELT pipelines and work with cloud technologies.`;
    }

    if (lower.includes('project')) {
        const topProject = data.projects[0];
        return `My top project is ${topProject.name} with a live dashboard (${topProject.live_url}). I've also built Databricks and Flask applications.`;
    }

    if (lower.includes('cert') || lower.includes('certification')) {
        const certs = data.certifications.completed.slice(0, 3).map(c => c.name.split('(')[0].trim()).join(', ');
        return `I'm certified in ${certs}. Currently pursuing ${data.certifications.in_progress[0].name}.`;
    }

    if (lower.includes('education') || lower.includes('university') || lower.includes('degree')) {
        return `${data.education.degree} student at ${data.education.institution}, graduating ${data.education.expected_graduation}.`;
    }

    if (lower.includes('goal') || lower.includes('career') || lower.includes('looking for')) {
        return `${data.goals.short_term[0]}. ${data.goals.long_term[0]}`;
    }

    if (lower.includes('strength') || lower.includes('good at') || lower.includes('work style')) {
        return data.strengths.slice(0, 2).join('. ') + '.';
    }

    if (lower.includes('contact') || lower.includes('email') || lower.includes('reach') || lower.includes('hire')) {
        return `Email: ${data.contact.email} | GitHub: ${data.contact.github} | LinkedIn: ${data.contact.linkedin}`;
    }

    if (lower.includes('databricks') || lower.includes('medallion')) {
        const dbProject = data.projects.find(p => p.name.includes('Databricks'));
        return dbProject ? dbProject.summary : "I have Databricks experience with Medallion Architecture.";
    }

    if (lower.includes('azure') || lower.includes('cloud')) {
        const azureCert = data.certifications.completed.find(c => c.name.includes('Azure'));
        return `${azureCert.name} certified, pursuing ${data.certifications.in_progress[0].name}. Experience with Azure Data Factory, Storage, and Databricks.`;
    }

    return `Hi! I'm ${data.personal.name.split(' ')[0]}'s AI assistant. Ask me about skills, projects, certifications, education, or contact info!`;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadProfileData, generateResponse };
}
