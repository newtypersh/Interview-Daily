export function toListItem(row) {
    return {
        id: Number(row.id),
        userId: Number(row.userId),
        name: row.name,
        category: row.category,
        created_at: row.created_at ? row.created_at.toISOString() : null,
        updated_at: row.updated_at ? row.updated_at.toISOString() : null,  
    };
}

export function toQuestionItem(row) {
    return {
        id: Number(row.id),
        question_set_id: Number(row.question_set_id),
        content: row.content,
        order: row.order,
        created_at: row.created_at ? row.created_at.toISOString() : null,
        updated_at: row.updated_at ? row.updated_at.toISOString() : null,
    };
}
