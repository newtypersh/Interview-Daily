export function toListItem(row) {
  return {
    id: row.id != null ? String(row.id) : null,
    userId: row.user_id != null ? String(row.user_id) : null,
    name: row.name ?? null,
    category: row.category ?? null,
    questionCount: row._count?.questions ?? 0,
    created_at: row.created_at ? row.created_at.toISOString() : null,
    updated_at: row.updated_at ? row.updated_at.toISOString() : null,
  };
}

export function toQuestionItem(row) {
  return {
    id: row.id != null ? String(row.id) : null,
    questionSetId: row.question_set_id != null ? String(row.question_set_id) : null,
    content: row.content ?? null,
    order: row.order ?? null,
    created_at: row.created_at ? row.created_at.toISOString() : null,
    updated_at: row.updated_at ? row.updated_at.toISOString() : null,
  };
}
