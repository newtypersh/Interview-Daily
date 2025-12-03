export function toFeedbackTemplateDto(row) {
    return {
        id: row.id != null ? String(row.id) : null,
        userId: row.user_id != null ? String(row.user_id) : null,
        category: row.category ?? null,
        templateText: row.template_text ?? null,
        createdAt: row.created_at ? row.created_at.toISOString() : null,
        updatedAt: row.updated_at ? row.updated_at.toISOString() : null,    
    };
}