export function handleError(error, contextMessage = 'Ошибка') {
    let finalMessage = contextMessage;

    if (error?.response?.data) {
        const data = error.response.data;

        if (typeof data === 'object' && !Array.isArray(data)) {
            const message = Object.entries(data)
                .map(([field, msg]) => `${field}: ${msg}`)
                .join('\n');
            finalMessage += `:\n${message}`;
        }
        // Ошибки в виде массива строк
        else if (Array.isArray(data)) {
            finalMessage += `:\n${data.join('\n')}`;
        }
        // Простое текстовое сообщение
        else if (typeof data === 'string') {
            finalMessage += `:\n${data}`;
        }
        else {
            finalMessage += `: Unknown error format`;
        }
    } else {
        finalMessage += `: ${error.message || 'Unknown error'}`;
    }

    alert(finalMessage, "error");
    console.error(`[${contextMessage}]`, error);
}
