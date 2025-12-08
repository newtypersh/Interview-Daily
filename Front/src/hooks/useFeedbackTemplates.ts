import { useMemo } from 'react';

import { INTERVIEW_CATEGORIES, CATEGORY_TITLES, CATEGORY_LIST } from '../constants/interview';
import { useFeedbackTemplatesQuery } from '../react-query/queries/useFeedbackTemplatesQuery';
import { useUpdateFeedbackTemplate } from '../react-query/mutation/useFeedbackTemplateMutations';

export interface UI_FeedbackTemplate {
  type: keyof typeof INTERVIEW_CATEGORIES;
  title: string;
  content: string;
}

export const useFeedbackTemplates = () => {
  const { data: rawTemplates = [], isLoading, error } = useFeedbackTemplatesQuery();
  const { mutate: updateTemplate, isPending: isUpdating } = useUpdateFeedbackTemplate();

  const templates: UI_FeedbackTemplate[] = useMemo(() => {
    if (!rawTemplates) return [];
    
    const mapped = rawTemplates.map((t) => ({
      type: t.category,
      title: CATEGORY_TITLES[t.category] || t.category,
      content: t.templateText || '',
    }));

    // Sort based on CATEGORY_LIST order
    const order = CATEGORY_LIST.map(c => c.id);
    return mapped.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));
  }, [rawTemplates]);

  return {
    templates,
    isLoading,
    error,
    updateTemplate,
    isUpdating,
  };
};
