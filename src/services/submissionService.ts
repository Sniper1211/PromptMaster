
interface SubmissionData {
    title: string;
    category: string;
    tags: string[];
    description: string;
    content: string;
    chineseContent?: string;
    expectedOutput: string;
    usage: string;
    contact?: string; // Optional email for notifications
}

interface SubmissionResponse {
    success: boolean;
    message?: string;
}

export const submitPrompt = async (data: SubmissionData): Promise<SubmissionResponse> => {
    const webhookUrl = import.meta.env.VITE_SUBMISSION_WEBHOOK_URL;

    if (!webhookUrl) {
        // Simulate success in development/demo mode if no webhook is configured
        console.warn('VITE_SUBMISSION_WEBHOOK_URL is not set. Simulating success.');
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: 'Simulated success: Webhook URL not configured.' });
            }, 1500);
        });
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                submittedAt: new Date().toISOString(),
                source: 'PentaPrompt Web',
            }),
        });

        if (response.ok) {
            return { success: true };
        } else {
            return { success: false, message: `Server error: ${response.statusText}` };
        }
    } catch (error) {
        console.error('Submission failed:', error);
        return { success: false, message: 'Network error. Please try again.' };
    }
};

export const createPrompt = async (data: any, token: string): Promise<SubmissionResponse> => {
    try {
        const response = await fetch('/api/prompts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            return { success: true };
        } else {
            const errorData = await response.json();
            return { success: false, message: errorData.error || `Server error: ${response.statusText}` };
        }
    } catch (error) {
        console.error('Creation failed:', error);
        return { success: false, message: 'Network error. Please try again.' };
    }
};

export const analyzePrompt = async (rawText: string, token: string): Promise<any> => {
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ rawText }),
        });

        if (response.ok) {
            return await response.json();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'AI Analysis failed');
        }
    } catch (error) {
        console.error('Analysis failed:', error);
        throw error;
    }
};
