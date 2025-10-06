import { useState } from 'react';

interface QuestionSetSelection {
  id: string;
  name: string;
  selected: boolean;
}

interface FeedbackTemplate {
  type: 'job_competency' | 'personality' | 'motivation';
  title: string;
  content: string;
}

// Mock data
const initialQuestionSets = {
  job_competency: [
    { id: '1', name: '질문세트1', selected: true },
    { id: '2', name: '질문세트2', selected: false },
  ],
  personality: [
    { id: '3', name: '질문세트1', selected: false },
    { id: '4', name: '질문세트2', selected: false },
  ],
  motivation: [
    { id: '5', name: '질문세트1', selected: false },
    { id: '6', name: '질문세트2', selected: false },
  ],
};

const initialTemplates: FeedbackTemplate[] = [
  {
    type: 'job_competency',
    title: '직무 역량 면접',
    content: '## 1. 질문에 대해 들었을 때 무엇을 답변해야 하고 있나요?\n## 2. 질문에 대해 내용을 정리한 경험에 기반하여 리드했던 내용이 있나요?\n## 3. 질문에 대해 주변 수구팀 이외 것이 있나요?'
  },
  {
    type: 'personality',
    title: '인성면접',
    content: '## 1. 질문에 대해 타인이 고워하던 경험을 거라 무릇 수 있나요?\n## 2. 이해가지 않아진 일을 타타이 타타이 타타에 수경이 이성비의 홀려량을 홀래요?\n## 3. 질문에 대해 타타 타타 타타마 본 구해한 경험을 하고 있다면 있나요?'
  },
  {
    type: 'motivation',
    title: '지원동기 면접',
    content: '## 1. 단지에 가기/타타에 타타 보서이 소자이을 끊게 할 발생양니까?\n## 2. 본디의 끊었을 직타인 본류학의 타타마니까?\n## 3. 타타에 구끊스수로 잘 실명하니까?'
  },
];

export default function Settings() {
  const [questionSets, setQuestionSets] = useState(initialQuestionSets);
  const [templates, setTemplates] = useState(initialTemplates);
  const [activeTab, setActiveTab] = useState<'questions' | 'templates'>('questions');

  const handleQuestionSetToggle = (
    category: keyof typeof questionSets,
    id: string
  ) => {
    setQuestionSets({
      ...questionSets,
      [category]: questionSets[category].map((set) =>
        set.id === id ? { ...set, selected: !set.selected } : set
      ),
    });
  };

  const handleTemplateChange = (type: FeedbackTemplate['type'], content: string) => {
    setTemplates(
      templates.map((template) =>
        template.type === type ? { ...template, content } : template
      )
    );
  };

  const handleAddQuestionSet = (category: keyof typeof questionSets) => {
    const newId = String(Date.now());
    const newSetNumber = questionSets[category].length + 1;
    setQuestionSets({
      ...questionSets,
      [category]: [
        ...questionSets[category],
        { id: newId, name: `질문세트${newSetNumber}`, selected: false },
      ],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('questions')}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                  activeTab === 'questions'
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                질문 설정
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                  activeTab === 'templates'
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                피드백 템플릿 설정
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            {activeTab === 'questions' ? (
              <div className="space-y-8">
                {/* Job Competency */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">직무 역량 면접</h2>
                  <div className="space-y-3">
                    {questionSets.job_competency.map((set, index) => (
                      <div key={set.id} className="flex items-center gap-3">
                        <span className="text-gray-600 w-8">{index + 1}.</span>
                        <input
                          type="text"
                          value={set.name}
                          readOnly
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                        <button
                          onClick={() => handleQuestionSetToggle('job_competency', set.id)}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            set.selected
                              ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          }`}
                        >
                          {set.selected ? '선택됨' : '선택'}
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddQuestionSet('job_competency')}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                    >
                      + 추가하기
                    </button>
                  </div>
                </div>

                {/* Personality */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">인성면접</h2>
                  <div className="space-y-3">
                    {questionSets.personality.map((set, index) => (
                      <div key={set.id} className="flex items-center gap-3">
                        <span className="text-gray-600 w-8">{index + 1}.</span>
                        <input
                          type="text"
                          value={set.name}
                          readOnly
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                        <button
                          onClick={() => handleQuestionSetToggle('personality', set.id)}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            set.selected
                              ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          }`}
                        >
                          {set.selected ? '선택됨' : '선택'}
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddQuestionSet('personality')}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                    >
                      + 추가하기
                    </button>
                  </div>
                </div>

                {/* Motivation */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">지원동기 면접</h2>
                  <div className="space-y-3">
                    {questionSets.motivation.map((set, index) => (
                      <div key={set.id} className="flex items-center gap-3">
                        <span className="text-gray-600 w-8">{index + 1}.</span>
                        <input
                          type="text"
                          value={set.name}
                          readOnly
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                        <button
                          onClick={() => handleQuestionSetToggle('motivation', set.id)}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            set.selected
                              ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          }`}
                        >
                          {set.selected ? '선택됨' : '선택'}
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddQuestionSet('motivation')}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                    >
                      + 추가하기
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {templates.map((template) => (
                  <div key={template.type}>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">{template.title}</h2>
                    <textarea
                      value={template.content}
                      onChange={(e) => handleTemplateChange(template.type, e.target.value)}
                      className="w-full min-h-[200px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none font-mono text-sm"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
